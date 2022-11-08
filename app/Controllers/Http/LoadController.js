"use strict";
const moment = require("moment");
const Database = use("Database");
const Company = use("App/Models/Company");
const Load = use("App/Models/Load");
const Pickup = use("App/Models/Pickup");
const Delivery = use("App/Models/Delivery");

class LoadController {
  // inserts load into database
  async createLoad({ auth, request, response }) {
    const {
      customer_id,
      load_reference,
      rate_confirmation_amount,
      driver_id,
      load_notes,
      invoice_notes,
      rate_confirmation_pdf
    } = await request.all().values;

    //Gets the id of the Company..aka Profile
    const companySelect = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const loadLength = await Load.query()
      .where({ company_id: companySelect.id })
      .fetch();

    const invoice_id = companySelect.invoice_starting_id;
    //Gets the starting invoice number and adds the length of loads.
    let currentCredits = companySelect.credits;
    let checkTodaysDate = moment(new Date());
    let checkCompanyCreateDate = moment(companySelect.created_at);

    let trial =
      moment.duration(checkTodaysDate.diff(checkCompanyCreateDate)).asDays() <=
      30;

    if (trial) {
      try {
        //Creates new load
        const newLoad = await Load.create({
          customer_id,
          load_reference,
          rate_confirmation_amount,
          rate_confirmation_pdf,
          driver_id,
          load_notes,
          invoice_notes,
          invoice_id,
          company_id: companySelect.id
        });

        //attaches the new load id to each pickup
        let pickups = await request.post().values.pickups;
        pickups.forEach(function(pickup) {
          pickup.load_id = newLoad.id;
        });
        //attaches the new load id to each delivery
        let deliveries = await request.post().values.deliveries;
        deliveries.forEach(function(delivery) {
          delivery.load_id = newLoad.id;
        });

        await Pickup.createMany(pickups);
        await Delivery.createMany(deliveries);

        const loadCreated = await Load.query()
          .with("customer")
          .with("driver")
          .with("pickups")
          .with("deliveries")
          .where({
            company_id: companySelect.id,
            id: newLoad.id
          })
          .first();

        await Database.table("companies")
          .where("id", companySelect.id)
          .increment("invoice_starting_id", 1);
        return loadCreated;
      } catch (error) {
        console.log("errror creating load");
        return error;
      }
    } else if (currentCredits > 0) {
      try {
        //Creates new load
        const newLoad = await Load.create({
          customer_id,
          load_reference,
          rate_confirmation_amount,
          rate_confirmation_pdf,
          driver_id,
          load_notes,
          invoice_notes,
          invoice_id,
          company_id: companySelect.id
        });

        //attaches the new load id to each pickup
        let pickups = await request.post().values.pickups;
        pickups.forEach(function(pickup) {
          pickup.load_id = newLoad.id;
        });
        //attaches the new load id to each delivery
        let deliveries = await request.post().values.deliveries;
        deliveries.forEach(function(delivery) {
          delivery.load_id = newLoad.id;
        });

        await Pickup.createMany(pickups);
        await Delivery.createMany(deliveries);

        const loadCreated = await Load.query()
          .with("customer")
          .with("driver")
          .with("pickups")
          .with("deliveries")
          .where({
            company_id: companySelect.id,
            id: newLoad.id
          })
          .first();

        await Database.table("companies")
          .where({ id: companySelect.id })
          .update({
            invoice_starting_id: invoice_id + 1,
            credits: companySelect.credits - 1
          });

        // await Database.table("companies")
        //   .where({ id: companySelect.id })
        // .increment("invoice_starting_id", 1);

        return loadCreated;
      } catch (error) {
        console.log("errror creating load");
        return error;
      }
    } else if (currentCredits < 1) {
      console.log("no credits");
      // return some kind of error message saying no credits available
    } else {
    }
  }

  async fetchAllLoadsDetails({ auth, request, response }) {
    const companySelect = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    if (auth.user.user_role_id === 22) {
      try {
        // const allLoads = await Load.query().where({company_id:request.all().id }).orderBy('id', 'desc').fetch()
        // const allLoads =await Load.query().innerJoin('pickups', 'pickups.load_id', 'loads.id').where('company_id', '=', currentCompany).options({nestTables:true}).groupBy('loads.id').fetch()
        const allLoads = await Load.query()
          .with("customer")
          .with("driver")
          .with("pickups")
          .with("deliveries")
          .where("company_id", "=", companySelect.id)
          .fetch();

        return allLoads;
      } catch (error) {
        console.log("theres an error");
      }
    } else if (auth.user.user_role_id === 42) {
      try {
        const allLoads = await Load.query()
          .with("customer")
          .with("driver")
          .with("pickups")
          .with("deliveries")
          .where({
            company_id: companySelect.id,
            driver_id: auth.user.driver_id
          })
          .fetch();
        return allLoads;
      } catch (error) {
        console.log("theres an error");
      }
    }
  }

  async updateLoad({ auth, request, response, params: { values } }) {
    const companySelect = await Company.query()
      .where({ id: auth.user.company_id })
      .first();
    //Load Id
    const loadId = await request.body.values.id;
    const data = await request.all().values;
    //pickups array of objects
    const pickups = await request.post().values.pickups;
    const deliveries = await request.post().values.deliveries;

    //this is for updates via the Accounting Modal - Needl BOL
    if (pickups === undefined && deliveries === undefined) {
      const {
        load_processed_type,
        rate_confirmation_amount,
        load_reimbursement,
        load_deduction,
        invoice_notes,
        load_notes,
        bill_of_lading,
        bill_of_lading_number,
        rate_confirmation_pdf,
        bill_of_lading_pdf,
        fuel_advance_fee,
        fuel_advance_amount,
        fuel_advance_date,
        customer_quickpay_fee,
        customer_paid_date,
        factor_fee_amount,
        factor_fee_other,
        factor_paid_date,
        factor_total_advanced,
        factor_reserve_held,
        factor_reserve_amount_paid
      } = await request.all().values;

      const load = await Database.table("loads")
        .where({ id: loadId })
        .update({
          load_processed_type,
          rate_confirmation_amount,
          load_reimbursement,
          load_deduction,
          invoice_notes,
          load_notes,
          bill_of_lading,
          bill_of_lading_number,
          rate_confirmation_pdf,
          bill_of_lading_pdf,
          fuel_advance_fee,
          fuel_advance_amount,
          fuel_advance_date,
          customer_quickpay_fee,
          customer_paid_date,
          factor_fee_amount,
          factor_fee_other,
          factor_total_advanced,
          factor_paid_date,
          factor_reserve_held,
          factor_reserve_amount_paid,
          factor_company_name: companySelect.factory_company_name,
          factor_fee_percentage: companySelect.factory_company_process_fee
            ? companySelect.factory_company_process_fee
            : 0,
          factor_reserve_percentage: companySelect.factory_company_reserve_fee
            ? companySelect.factory_company_reserve_fee
            : 0
        });

      const loadUpdated = await Load.query()
        .with("customer")
        .with("driver")
        .with("pickups")
        .with("deliveries")
        .where({
          id: loadId
        })
        .first();

      return loadUpdated;
    } else {
      //load fields that will be updated
      const {
        customer_id,
        load_reference,
        rate_confirmation_amount,
        driver_id,
        load_notes,
        invoice_notes,
        load_reimbursement,
        load_deduction,
        load_processed_type,
        bill_of_lading,
        bill_of_lading_number,
        rate_confirmation_pdf,
        bill_of_lading_pdf,
        fuel_advance_fee,
        fuel_advance_amount,
        fuel_advance_date,
        customer_quickpay_fee,
        customer_paid_date,
        factor_fee_amount,
        factor_fee_other,
        factor_total_advanced,
        factor_paid_date,
        factor_reserve_held,
        factor_reserve_amount_paid
      } = await request.all().values;

      // Updates or adds a new pickup depending if the new pickup does not have an id(not made previously)
      for (let pickup of pickups) {
        if (!pickup.load_id) {
          pickup.load_id = loadId;
          await Pickup.create(pickup);
        } else {
          await Pickup.query()
            .where({ id: pickup.id })
            .update(pickup);
        }
      }
      // Updates or adds a new delivery depending if the new pickup does not have an id(not made previously)
      for (let delivery of deliveries) {
        if (!delivery.load_id) {
          delivery.load_id = loadId;
          await Delivery.create(delivery);
        } else {
          await Delivery.query()
            .where({ id: delivery.id })
            .update(delivery);
        }
      }

      // updates load details
      const load = await Database.table("loads")
        .where({ id: loadId })
        .update({
          customer_id,
          load_reference,
          rate_confirmation_amount,
          driver_id,
          load_notes,
          invoice_notes,
          load_reimbursement,
          load_deduction,
          load_processed_type,
          bill_of_lading,
          bill_of_lading_number,
          rate_confirmation_pdf,
          bill_of_lading_pdf,
          fuel_advance_fee,
          fuel_advance_amount,
          fuel_advance_date,
          customer_quickpay_fee,
          customer_paid_date,
          factor_fee_amount,
          factor_fee_other,
          factor_total_advanced,
          factor_paid_date,
          factor_reserve_held,
          factor_reserve_amount_paid,
          factor_company_name: companySelect.factory_company_name,
          factor_fee_percentage: companySelect.factory_company_process_fee
            ? companySelect.factory_company_process_fee
            : 0
        });

      const loadUpdated = await Load.query()
        .with("customer")
        .with("driver")
        .with("pickups")
        .with("deliveries")
        .where({
          id: loadId
        })
        .first();

      return loadUpdated;
    }
  }

  async deletePickup({ auth, request, response, params: { pickupItem } }) {
    const pickupDelete = await JSON.parse(request.get().pickupItem);
    //
    const pickups = await Database.table("pickups")
      .where("id", pickupDelete.pickup_id)
      .delete();

    const loadUpdated = await Load.query()
      .with("customer")
      .with("driver")
      .with("pickups")
      .with("deliveries")
      .where({
        id: pickupDelete.pickup_load_id
      })
      .first();

    return [loadUpdated, pickupDelete];
  }

  async deleteDelivery({ auth, request, response }) {
    const deliveryDelete = await JSON.parse(request.get().deliveryItem);
    //
    const deliveries = await Database.table("deliveries")
      .where("id", deliveryDelete.delivery_id)
      .delete();

    const loadUpdated = await Load.query()
      .with("customer")
      .with("driver")
      .with("pickups")
      .with("deliveries")
      .where({
        id: deliveryDelete.delivery_load_id
      })
      .first();

    return [loadUpdated, deliveryDelete];
  }

  async updateLoadStatus({ auth, request, response }) {
    let id = await request.all().id;
    let status = await request.all();

    const updatedLoad = await Database.table("loads")
      .where({ id })
      .update(status);

    const loadUpdated = await Load.query()
      .with("customer")
      .with("driver")
      .with("pickups")
      .with("deliveries")
      .where({
        id
      })
      .first();
    return loadUpdated;
  }

  async updateLoadProcessedPayment({ auth, request, response }) {
    let data = await request.all().values;

    const updateLoad = await Database.table("loads")
      .where({ id: data.id })
      .update(data);

    return data;
  }

  async updateDriverPayroll({ auth, request, response }) {
    // let id = await request.all().id;
    let loads = await request.all().params;

    try {
      for (let load of loads) {
        await Load.query()
          .where({ id: load.id })
          .update(load);
      }

      return loads;
    } catch (error) {
      return false;
    }

    // const loadUpdated = await Load.query()
    //   .with("customer")
    //   .with("driver")
    //   .with("pickups")
    //   .with("deliveries")
    //   .with("driverPaid")
    //   .where({
    //     id
    //   })
    //   .first();
    // return loadUpdated
  }

  async deleteLoad({ auth, request, response }) {
    const user = await auth.user.toJSON();
    const loadData = await request.all().values;

    if (user.company_id == loadData.company_id) {
      try {
        const load = await Load.find(loadData.id);
        await load.delete();
        return {
          success: true,
          loadId: loadData.id
        };
      } catch (err) {
        return {
          success: false,
          loadId: loadData.id
        };
      }
    } else {
      console.log("false hit");
    }
  }
}

module.exports = LoadController;
