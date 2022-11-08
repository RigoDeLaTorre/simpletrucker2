"use strict";
const Mail = use("Mail");
const AWS = require("aws-sdk");
const uuid = require("uuid/v1");
// const keys = require('../../../config/dev')
// const s3 = new AWS.S3({
//   accessKeyId: keys.accessKeyId,
//   secretAccessKey: keys.secretAccessKey
// })
const Url = require("url-parse");
const Env = use("Env");
const Helpers = use("Helpers");
const Database = use("Database");
const Expense = use("App/Models/Expense");
const Company = use("App/Models/Company");
const Checkout = use("App/Models/Checkout");
// AWS
const ACCESS_KEY_ID = new Url(Env.get("ACCESS_KEY_ID"));
const SECRET_ACCESS_KEY = new Url(Env.get("SECRET_ACCESS_KEY"));
//STRIPE
const STRIPE_PUBLISHABLE_KEY = Env.get("STRIPE_PUBLISHABLE_KEY");
const STRIPE_SECRET_KEY = Env.get("STRIPE_SECRET_KEY");

const stripe = require("stripe")(STRIPE_SECRET_KEY);

const s3 = new AWS.S3({
  accessKeyId: Env.get("ACCESS_KEY_ID", ACCESS_KEY_ID),
  secretAccessKey: Env.get("SECRET_ACCESS_KEY", SECRET_ACCESS_KEY)
});

class ApiController {
  async getUserInfo({ auth, request, response }) {
    try {
      let user = auth.user.toJSON();
      delete user.password;
      delete user.user_role_id;
      return {
        user
      };
    } catch (error) {
      console.log("no user");
    }
  }

  async uploadRateBol({ auth, request }) {
    const loadId = request.only("load").load;
    const invoiceId = request.only("invoiceId").invoiceId;
    const folderName = request.only("folder").folder;
    const userEmail = auth.user.email;
    const userId = auth.user.id;

    const dataDetails = await Promise.all([
      loadId,
      invoiceId,
      folderName,
      userEmail,
      userId
    ]);

    const fileName =
      dataDetails[2] == "rateconfirmation"
        ? "rate_confirmation_pdf"
        : "bill_of_lading_pdf";

    // example .. auth.id/user@gmail.com/rateconfirmation/invoice_id/${invoice_id}rateconfirmation.pdf
    // example .. /user@gmail.com/bol/invoice_id/{invoice_id}bol.pdf

    const fileLocation =
      dataDetails[2] == "rateconfirmation"
        ? `/${dataDetails[4]}/${dataDetails[3]}/${dataDetails[2]}/${
            dataDetails[1]
          }/${dataDetails[1]}rateconfirmation.pdf`
        : `/${dataDetails[4]}/${dataDetails[3]}/${dataDetails[2]}/${
            dataDetails[1]
          }/${dataDetails[1]}bol.pdf`;

    const myPicture = request.file("image", {
      types: ["pdf"],
      size: "10mb"
    });

    // deletes current file
    // await fs.unlink(
    //   Helpers.publicPath(`${folderName}/${loadId}/${folderName}.pdf`)
    // );

    // Saves file to database, overrides previous
    await myPicture.move(
      Helpers.publicPath(
        `/${dataDetails[4]}/${dataDetails[3]}/${dataDetails[2]}/${
          dataDetails[1]
        }`
      ),
      {
        name: `${dataDetails[1]}${dataDetails[2]}.pdf`,
        overwrite: true
      }
    );

    const load = await Database.table("loads")
      .where({ id: dataDetails[0] })
      .update({
        [fileName]: fileLocation
      });

    //
    if (!myPicture.moved()) {
      return myPicture.error();
    }
    return {
      [fileName]: fileLocation,
      id: dataDetails[0],
      invoice_id: dataDetails[1]
    };
  }

  async uploadAwsFile({ auth, request, response }) {
    //type is rateconfirmation or bol
    const type = await request.only("type");
    const fileName = await request.only("fileName");

    //rateconfirmation/uuid/Invoice501-rate.pdf
    const key = `${type.type}/${uuid()}/${fileName.fileName}`;
    // return key
    try {
      const uploadLink = await s3.getSignedUrl("putObject", {
        Bucket: "simpletrucker",
        // ContentType:"image/jpeg",
        ContentType: "application/pdf",
        ContentDisposition: "inline",
        Key: key
      });
      return { uploadLink, key };
    } catch (error) {
      console.log("error");
    }
  }

  async deleteAwsFile({ auth, request, response }) {
    const delValues = await request.all();
    try {
      const url = delValues.link;

      let params = {
        Bucket: "simpletrucker",
        Key: url
      };
      s3.deleteObject(params, function(err, data) {
        if (err) {
          console.log(err, err.stack);
          return "error";
        } // an error occurred
        else {
          console.log("success");
          // return { id: delValues.id, [delValues.fieldName]: null }
        }
      });
      response.send({ id: delValues.id, [delValues.fieldName]: null });
    } catch (error) {
      return "error";
    }
  }

  async fetchExpenses({ auth, request, response }) {
    const data = await Expense.query()

      .with("truck")

      // .where({
      //   truck_id: truck_id
      // })
      .fetch();

    return data;
  }

  async stripe10({ session, auth, request, response }) {
    const data = await request.all();
    let newDataToStore;
    let creditError = null;
    let chargeError = null;
    let result = null;
    let chargeData = null;
    let credited_to_user = true;
    const creditAmount = 5;
    const amount = 1000;
    const description = "$10 for 5 credits";

    try {
      const charge = await stripe.charges.create({
        amount,
        currency: "usd",
        description,
        source: data.id,
        metadata: {
          user_id: auth.user.id,
          user_email: auth.user.email,
          first_name: auth.user.first_name,
          last_name: auth.user.last_name,
          company_id: auth.user.company_id
        }
      });
      chargeData = charge;

      try {
        const updateCompanyCredit = await Database.table("companies")
          .where({ id: auth.user.company_id })
          .increment("credits", creditAmount);
      } catch (err) {
        let currentUser = auth.user.toJSON();
        currentUser.creditsBought = creditAmount;
        try {
          credited_to_user = false;
          await Mail.send("emails.stripeerror", currentUser, message => {
            message
              .to(auth.user.email)
              .bcc("support@simpletrucker.com")
              .from("support@simpletrucker.com", "Simple Trucker")
              .subject(`Load Credit Purchase - ${description}`);
          });
          return {
            error:
              "Charged, but credits were not added. We have sent you an email confirmation and we will correct it within 24 hours !"
          };
        } catch (err) {
          credited_to_user = false;
          return {
            error:
              "Charged, but credits were not added. Please contact support."
          };
        }
      }
    } catch (err) {
      return {
        error: "Charge did not go through, please try again"
      };
    } finally {
      if (chargeData) {
        const profile = await Checkout.create({
          user_id: auth.user.id,
          company_id: auth.user.company_id,
          charge_id: chargeData.id,
          amount: chargeData.amount,
          amount_refunded: chargeData.amount_refunded,
          balance_transaction: chargeData.balance_transaction,
          captured: chargeData.captured,
          currency: chargeData.currency,
          fingerprint: chargeData.source.fingerprint,
          description: chargeData.description,
          payment_method: chargeData.payment_method,
          transaction_id: chargeData.balance_transaction,
          card_cvc_check: chargeData.source.cvc_check,
          card_zip: chargeData.source.address_zip,
          card_number: chargeData.source.last4,
          card_email: chargeData.billing_details.name,
          card_charge_date: chargeData.created,
          status: chargeData.status,
          charge_created: chargeData.created,
          paid: chargeData.paid,
          credited_to_user
        });
        newDataToStore = {
          ...profile.toJSON(),
          user: {
            first_name: auth.user.first_name,
            last_name: auth.user.last_name
          }
        };
      } else {
        console.log("no data");
      }
      console.log("finally");
    }

    return {
      success: `Sucessfully added ${description}`,
      data: newDataToStore
    };
  }
  async stripe30({ session, auth, request, response }) {
    const data = await request.all();
    let newDataToStore;
    let creditError = null;
    let chargeError = null;
    let result = null;
    let chargeData = null;
    let credited_to_user = true;
    const creditAmount = 15;
    const amount = 3000;
    const description = "$30 for 15 credits";

    try {
      const charge = await stripe.charges.create({
        amount,
        currency: "usd",
        description,
        source: data.id,
        metadata: {
          user_id: auth.user.id,
          user_email: auth.user.email,
          first_name: auth.user.first_name,
          last_name: auth.user.last_name,
          company_id: auth.user.company_id
        }
      });
      chargeData = charge;

      try {
        const updateCompanyCredit = await Database.table("companies")
          .where({ id: auth.user.company_id })
          .increment("credits", creditAmount);
      } catch (err) {
        let currentUser = auth.user.toJSON();
        currentUser.creditsBought = creditAmount;
        try {
          credited_to_user = false;
          await Mail.send("emails.stripeerror", currentUser, message => {
            message
              .to(auth.user.email)
              .bcc("support@simpletrucker.com")
              .from("support@simpletrucker.com", "Simple Trucker")
              .subject(`Load Credit Purchase - $${description}`);
          });
          return {
            error:
              "Charged, but credits were not added. We have sent you an email confirmation and we will correct it within 24 hours !"
          };
        } catch (err) {
          credited_to_user = false;
          return {
            error:
              "Charged, but credits were not added. Please contact support."
          };
        }
      }
    } catch (err) {
      return {
        error: "Charge did not go through, please try again"
      };
    } finally {
      if (chargeData) {
        const profile = await Checkout.create({
          user_id: auth.user.id,
          company_id: auth.user.company_id,
          charge_id: chargeData.id,
          amount: chargeData.amount,
          amount_refunded: chargeData.amount_refunded,
          balance_transaction: chargeData.balance_transaction,
          captured: chargeData.captured,
          currency: chargeData.currency,
          fingerprint: chargeData.source.fingerprint,
          description: chargeData.description,
          payment_method: chargeData.payment_method,
          transaction_id: chargeData.balance_transaction,
          card_cvc_check: chargeData.source.cvc_check,
          card_zip: chargeData.source.address_zip,
          card_number: chargeData.source.last4,
          card_email: chargeData.billing_details.name,
          card_charge_date: chargeData.created,
          status: chargeData.status,
          charge_created: chargeData.created,
          paid: chargeData.paid,
          credited_to_user
        });

        newDataToStore = {
          ...profile.toJSON(),
          user: {
            first_name: auth.user.first_name,
            last_name: auth.user.last_name
          }
        };
      } else {
        console.log("no data");
      }
      console.log("finally");
    }

    return {
      success: `Sucessfully added ${description} `,
      data: newDataToStore
    };
  }
  async stripe50({ session, auth, request, response }) {
    const data = await request.all();
    let newDataToStore;
    let creditError = null;
    let chargeError = null;
    let result = null;
    let chargeData = null;
    let credited_to_user = true;
    const creditAmount = 25;
    const amount = 5000;
    const description = "$50 for 25 credits";

    try {
      const charge = await stripe.charges.create({
        amount,
        currency: "usd",
        description,
        source: data.id,
        metadata: {
          user_id: auth.user.id,
          user_email: auth.user.email,
          first_name: auth.user.first_name,
          last_name: auth.user.last_name,
          company_id: auth.user.company_id
        }
      });
      chargeData = charge;

      try {
        const updateCompanyCredit = await Database.table("companies")
          .where({ id: auth.user.company_id })
          .increment("credits", creditAmount);
      } catch (err) {
        let currentUser = auth.user.toJSON();
        currentUser.creditsBought = creditAmount;
        try {
          credited_to_user = false;
          await Mail.send("emails.stripeerror", currentUser, message => {
            message
              .to(auth.user.email)
              .bcc("support@simpletrucker.com")
              .from("support@simpletrucker.com", "Simple Trucker")
              .subject(`Load Credit Purchase - $${description}`);
          });
          return {
            error:
              "Charged, but credits were not added. We have sent you an email confirmation and we will correct it within 24 hours !"
          };
        } catch (err) {
          credited_to_user = false;
          return {
            error:
              "Charged, but credits were not added. Please contact support."
          };
        }
      }
    } catch (err) {
      return {
        error: "Charge did not go through, please try again"
      };
    } finally {
      if (chargeData) {
        const profile = await Checkout.create({
          user_id: auth.user.id,
          company_id: auth.user.company_id,
          charge_id: chargeData.id,
          amount: chargeData.amount,
          amount_refunded: chargeData.amount_refunded,
          balance_transaction: chargeData.balance_transaction,
          captured: chargeData.captured,
          currency: chargeData.currency,
          fingerprint: chargeData.source.fingerprint,
          description: chargeData.description,
          payment_method: chargeData.payment_method,
          transaction_id: chargeData.balance_transaction,
          card_cvc_check: chargeData.source.cvc_check,
          card_zip: chargeData.source.address_zip,
          card_number: chargeData.source.last4,
          card_email: chargeData.billing_details.name,
          card_charge_date: chargeData.created,
          status: chargeData.status,
          charge_created: chargeData.created,
          paid: chargeData.paid,
          credited_to_user
        });

        newDataToStore = {
          ...profile.toJSON(),
          user: {
            first_name: auth.user.first_name,
            last_name: auth.user.last_name
          }
        };
      } else {
        console.log("no data");
      }
      console.log("finally");
    }

    return {
      success: `Sucessfully added ${description}`,
      data: newDataToStore
    };
  }
}

module.exports = ApiController;
