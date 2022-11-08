"use strict";
const { validate } = use("Validator");
const PasswordReset = use("App/Models/PasswordReset");
const randomString = require("random-string");
const Mail = use("Mail");

const Hash = use("Hash");
const User = use("App/Models/User");
const UserSetting = use("App/Models/UserSetting");

class AuthController {
  async register({ response, request, view }) {
    return view.render("auth/register");
  }

  async storeUser({ request, session, response, auth }) {
    let userCurrentData = {
      first_name: request.input("first_name"),
      last_name: request.input("last_name"),
      email: request.input("email")
    };
    // Validation rules
    const validation = await validate(request.all(), {
      first_name: "required|min:3|max:50",
      last_name: "required|min:3|max:50",
      email: "required|email|unique:users,email",
      password: "required|min:6|max:40",
      confirm_password: "required"
    });

    // check if PASSWORDS match
    if (request.input("password") == request.input("confirm_password")) {
      //check if it fails validation
      if (validation.fails()) {
        session.withErrors(validation.messages()).flashExcept(["password"]);

        return response.redirect("back");
      } else {
        // save user to database
        try {
          let newUser = await User.create({
            first_name: request.input("first_name"),
            last_name: request.input("last_name"),
            email: request.input("email"),
            password: request.input("password")
          });

          let newUserSetting = await UserSetting.create({
            user_id: newUser.id
          });
        } catch (error) {
          //show errors if problems with database

          session
            .withErrors([
              {
                field: "database",
                message: "problem with database try later"
              }
            ])
            .flashExcept(["password"]);
          return response.redirect("/");
        }

        try {
          await Mail.send("emails.welcome", userCurrentData, message => {
            message
              .to(userCurrentData.email)
              .from("support@simpletrucker.com", "Simple Trucker")
              .subject(`Simple Truker - 30 Day Free Trial`);
          });

          session.flash({
            notification: {
              type: "success",
              message: `Successfully created ${userCurrentData.email}`
            }
          });
          return response.redirect("/home");
        } catch (error) {
          session.flash({
            notification: {
              type: "success",
              message: `Successfully created ${request.input("email")}`
            }
          });

          return response.redirect("/home");
        }
      }
    } else {
      //show errors if passwords dont match
      session
        .withErrors([
          {
            field: "password",
            message: "need to confirm password"
          },
          {
            field: "confirm_password",
            message: "need to confirm password"
          }
        ])
        .flashExcept(["password"]);
      return response.redirect("back");
      return "passwords dont match";
    }
  }

  async storeUserDriver({ request, session, response, auth }) {
    // Validation rules
    const validation = await validate(request.all(), {
      first_name: "required|min:3|max:50",
      last_name: "required|min:3|max:50",
      email: "required|email|unique:users,email",
      password: "required|min:6|max:40",
      confirm_password: "required"
    });

    // check if PASSWORDS match
    if (request.input("password") == request.input("confirm_password")) {
      //check if it fails validation
      if (validation.fails()) {
        session.withErrors(validation.messages()).flashExcept(["password"]);

        return response.redirect("back");
      } else {
        // save user to database
        try {
          let newUser = await User.create({
            first_name: request.input("first_name"),
            last_name: request.input("last_name"),
            email: request.input("email"),
            password: request.input("password"),
            driver_id: request.input("driver_id"),
            company_id: auth.user.company_id,
            user_role_id: 42
          });

          let newUserSetting = await UserSetting.create({
            user_id: newUser.id
          });
        } catch (error) {
          //show errors if problems with database

          session
            .withErrors([
              {
                field: "database",
                message: "problem with database try later"
              }
            ])
            .flashExcept(["password"]);
          return response.redirect("/");
        }
        session.flash({
          notification: {
            type: "success",
            message: "Created Driver Login Successfully"
          }
        });
        return response.redirect("/driver/showDrivers");
      }
    } else {
      //show errors if passwords dont match
      session
        .withErrors([
          {
            field: "password",
            message: "need to confirm password"
          },
          {
            field: "confirm_password",
            message: "need to confirm password"
          }
        ])
        .flashExcept(["password"]);
      return response.redirect("back");
      return "passwords dont match";
    }
  }

  async login({ auth, response, request, view }) {
    console.log("checking login");
    try {
      await auth.check();
      return response.redirect("/home");
    } catch (err) {
      return view.render("auth/login");
    }
  }

  async loginUser({ response, request, view, auth, session }) {
    //capture the data from the form
    const postData = request.post();
    //find the user in the database by their Email
    const user = await User.query()
      .where("email", postData.email)
      .first();
    if (user) {
      //verify the password
      const passwordVerified = await Hash.verify(
        postData.password,
        user.password
      );

      if (passwordVerified) {
        //login user
        try {
          await auth.check();
        } catch (error) {
          await auth.remember(true).login(user);
        }
        // await auth.login(user)
        return response.redirect("/home");
      } else {
        //password incorrect
        session
          .withErrors([
            {
              field: "password",
              message: "Incorrect Password"
            }
          ])
          .flashExcept(["password"]);

        return response.redirect("back");
      }
    } else {
      //cant find user with that email
      session
        .withErrors([
          {
            field: "email",
            message: "Email Not found"
          }
        ])
        .flashExcept(["password"]);

      return response.redirect("back");
    }
    //verify the passwords
  }

  async logout({ response, request, view, auth }) {
    try {
      await auth.logout();
      return response.redirect("/");
    } catch (error) {
      return "Error could not logout";
    }
  }
}

module.exports = AuthController;
