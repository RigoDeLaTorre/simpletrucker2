"use strict";
const { validate } = use("Validator");
const Database = use("Database");
const Company = use("App/Models/Company");
const Driver = use("App/Models/Driver");

class DriverController {
  async createDriver({ auth, request, response, params: { id, values } }) {
    // id is the company id this driver belongs to
    //data is the values of new Driver
    const data = await request.post().values;
    const company = await request.post().id;

    const driver = await Driver.create({
      ...data,
      company_id: company
    });

    return driver;
  }

  async fetchDrivers({ auth, request, response }) {
    try {
      const currentCompany = await Company.query()
        .where({ id: auth.user.company_id })
        .first();

      const drivers = await Driver.query()
        .with("user")
        .where({ company_id: currentCompany.id })
        .fetch();

      return drivers;
    } catch (error) {}
  }

  async updateDriver({ auth, request, response, params: { values } }) {
    const data = await request.body.values;

    const driver = await Database.table("drivers")
      .where({ id: data.id })
      .update({
        ...data
      });

    const theUpdatedDriver = await Driver.query()
      .where({ id: data.id })
      .first();

    return theUpdatedDriver;
  }
  async updateDriverPatch({ session, view, auth, request, response }) {
    const data = await request.all();

    delete data._csrf;
    delete data._method;

    if (data.driver_email || data.driver_email == "") {
      const validation = await validate(request.all(), {
        driver_email: "required|email"
      });
      if (validation.fails()) {
        session.withErrors(validation.messages());
        return response.redirect("back");
      } else {
        const driver = await Database.table("drivers")
          .where({ id: data.id })
          .update({
            ...data
          });
        session.flash({ notification: "Updated Successfuly" });
        return response.redirect("/driver/showDrivers");
      }
    } else {
      const driver = await Database.table("drivers")
        .where({ id: data.id })
        .update({
          ...data
        });
      session.flash({ notification: "Updated Successfuly" });
      return response.redirect("back");
      // return response.redirect('/driver/showDrivers')
    }
  }

  async deleteDriver({ auth, request, response, params: { id } }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();
    const data = request.get().id;
    const driver = await Driver.find(data);

    try {
      let driverName = driver.driver_first_name + " " + driver.driver_last_name;
      await driver.delete();

      return { success: `Successfully deleted ${driverName}` };
    } catch (err) {
      console.log(err);
      return {
        error: "Failed, please try again or contact support"
      };
    }
  }
}

module.exports = DriverController;
