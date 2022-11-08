"use strict";
const { validate, validateAll } = use("Validator");
const randomString = require("random-string");
const Hash = use("Hash");
const User = use("App/Models/User");
const PasswordReset = use("App/Models/PasswordReset");
const Mail = use("Mail");

/**
 * Resourceful controller for interacting with passwordresets
 */
class PasswordResetController {
  /**
   * Show a list of all passwordresets.
   * GET passwordresets
   */

  async forgotPassword({ response, request, view }) {
    return view.render("auth/forgotPassword");
  }
  async showResetForm({ params, view }) {
    return view.render("auth.resetpass", { token: params.token });
  }
  async sendRequestLinkEmail({ request, session, response }) {
    //validate form inputs
    const validation = await validate(request.only("email"), {
      email: "required|email"
    });

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll();
      return response.redirect("back");
    }
    try {
      const user = await User.findBy("email", request.input("email"));

      await PasswordReset.query()
        .where("email", user.email)
        .delete();

      const { token } = await PasswordReset.create({
        email: user.email,
        token: randomString({ length: 40 })
      });

      const mailData = {
        user: user.toJSON(),
        token
      };
      console.log("mailData", mailData);
      try {
        await Mail.send("emails.passwordreset", mailData, message => {
          message
            .to(user.email)
            .from("support@simpletrucker.com", "Simple Trucker")
            .subject("Password Reset Link");
        });
        session.flash({
          notification: {
            type: "success",
            message: `A password reset link has been sent to ${user.email}`
          }
        });
        return response.redirect("back");
      } catch (error) {
        session.flash({
          notification: {
            type: "danger",
            message:
              "Email found, but there was an error sending the email, please contact support"
          }
        });
        return response.redirect("back");
      }
    } catch (error) {
      console.log("first");
      // session
      //   .withErrors([
      //     {
      //       field: "email",
      //       message: "Email Not found"
      //     }
      //   ])
      //   .flashExcept(["password"]);
      session.flash({
        notification: {
          type: "danger",
          message: `Sorry, there is no user with this email address ${
            request.only("email").email
          }`
        }
      });
      return response.redirect("back");
    }
  }

  async reset({ session, request, response, view }) {
    const validation = await validateAll(request.all(), {
      token: "required",
      email: "required",
      password: "required|confirmed|min:6|max:40"
    });

    if (validation.fails()) {
      let message = validation.messages()[0].message;
      let messageValidation = validation.messages()[0].validation;
      if (messageValidation == "min") {
        message = "Minimum of 6 characters for password";
      } else if (messageValidation == "max") {
        message = "Too many characters, please shorten password";
      } else if (messageValidation == "confirmed") {
        message = "Passwords do not match, please try again";
      }
      session.flash({
        notification: {
          type: "danger",
          message
        }
      });
      // session.withErrors(validation.messages()).flashExcept(['password'])
      return response.redirect("back");
    }
    // if  get users by provider email

    try {
      const user = await User.findBy("email", request.input("email"));

      const token = await PasswordReset.query()
        .where({
          email: user.email,
          token: request.input("token")
        })
        .first();

      if (!token) {
        session.flash({
          notification: {
            type: "danger",
            message:
              "This password reset token does not exist or has expired. Please click on the latest link or request a new password reset link."
          }
        });
        return response.redirect("back");
      }

      user.password = request.input("password");
      await user.save();
      await PasswordReset.query()
        .where("email", user.email)
        .delete();

      session.flash({
        notification: {
          type: "success",
          message: "Your password has been reset !"
        }
      });
      return response.redirect("/login");
    } catch (error) {
      console.log("second");
      session.flash({
        notification: {
          type: "danger",
          message: "Sorry, there is no user with this email address"
        }
      });
    }
    return response.redirect("back");
  }
}

module.exports = PasswordResetController;
