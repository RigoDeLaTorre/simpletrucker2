"use strict";
const Company = use("App/Models/Company");
const Driver = use("App/Models/Driver");
const Load = use("App/Models/Load");

class PageController {
  async home({ view, auth }) {
    console.log("backend home route");
    if (auth.user && auth.user.user_role_id === 42) {
      const activeLoad = await Load.query()
        .with("customer")
        .with("driver")
        .with("pickups")
        .with("deliveries")
        .where({
          company_id: auth.user.company_id,
          driver_id: auth.user.driver_id,
          load_status: "active"
        })
        .fetch();
      return view.render("pages/driver/activeLoad", {
        loads: activeLoad.toJSON(),
        firstName: auth.user.first_name,
        lastName: auth.user.last_name
      });
    } else if (auth.user && auth.user.user_role_id === 32) {
      return view.render("pages/home");
    } else if (auth.user && auth.user.user_role_id === 22) {
      return view.render("pages/home");
    } else if (auth.user && auth.user.user_role_id === 12) {
      return view.render("pages/home");
    } else if (auth.user && auth.user.user_role_id === 2) {
      return view.render("pages/home");
    } else {
      return view.render("auth/login");
    }
  }
  async activeLoad({ auth, view }) {
    const activeLoad = await Load.query()
      .with("customer")
      .with("driver")
      .with("pickups")
      .with("deliveries")
      .where({
        company_id: auth.user.company_id,
        driver_id: auth.user.driver_id,
        load_status: "active"
      })
      .fetch();

    return view.render("pages/driver/activeLoad", {
      loads: activeLoad.toJSON(),
      firstName: auth.user.first_name,
      lastName: auth.user.last_name
    });
  }

  async deliveredLoad({ auth, view }) {
    const deliveredLoad = await Load.query()
      .with("customer")
      .with("driver")
      .with("pickups")
      .with("deliveries")
      .where({
        company_id: auth.user.company_id,
        driver_id: auth.user.driver_id,
        load_status: "delivered"
      })
      .fetch();

    return view.render("pages/driver/deliveredLoads", {
      loads: deliveredLoad.toJSON(),
      firstName: auth.user.first_name,
      lastName: auth.user.last_name
    });
  }

  async loaddetails({ auth, view, params, response }) {
    try {
      const loadDetails = await Load.query()
        .with("customer")
        .with("driver")
        .with("pickups")
        .with("deliveries")
        .where({
          id: params.id,
          company_id: auth.user.company_id,
          driver_id: auth.user.driver_id
        })
        .first();

      return view.render("pages/driver/loaddetails", {
        load: loadDetails.toJSON(),
        firstName: auth.user.first_name,
        lastName: auth.user.last_name
      });
      // return view.render("pages/driver/deliveredLoads");
    } catch (err) {
      response.redirect("/home");
    }
  }

  async welcome({ view }) {
    return view.render("pages/login");
  }

  async createDriverUser({ auth, request, response, view, params }) {
    try {
      const currentCompany = await Company.query()
        .where({ id: auth.user.company_id })
        .first();

      try {
        const drivers = await Driver.query()
          .with("user")
          .where({ id: params.id })
          .first();

        if (
          auth.user.user_role_id === 22 &&
          drivers.company_id == currentCompany.id
        ) {
          return view.render("pages/user/registerDriver", {
            first_name: drivers.driver_first_name,
            last_name: drivers.driver_last_name,
            email: drivers.driver_email,
            id: drivers.id
          });
        } else {
          return response.status(400).send({
            message: "You dont have access to that information !"
          });
        }
      } catch (err) {
        return response.status(400).send({
          message: "No Drivers found !"
        });
      }
    } catch (err) {
      return response.status(400).send({
        message: "Your company was not found, go back home  !"
      });
    }

    // return view.render('auth/registerDriver',{
    // name:nameValue
    // })
    // return response.redirect('/driver/adduser')
  }

  async showDrivers({ auth, request, response, view }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const drivers = await Driver.query()
      .with("user")
      .where({ company_id: currentCompany.id })
      .fetch();

    if (auth.user.user_role_id === 22) {
      return view.render("pages/user/showDrivers", {
        drivers: drivers.toJSON(),
        companyName: currentCompany.company_bill_name
      });
    }

    // return view.render('auth/registerDriver',{
    // name:nameValue
    // })
    // return response.redirect('/driver/adduser')
  }

  async updateDriverEmail({ auth, request, response, view, params }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const drivers = await Driver.query()
      .with("user")
      .where({ id: params.id })
      .first();

    if (auth.user.user_role_id === 22) {
      return view.render("pages/user/updateEmailDriver", {
        first_name: drivers.driver_first_name,
        last_name: drivers.driver_last_name,
        id: drivers.id
      });
    }
  }
}

module.exports = PageController;
