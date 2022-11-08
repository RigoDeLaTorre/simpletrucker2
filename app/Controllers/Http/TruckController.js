"use strict";
const Database = use("Database");
const Truck = use("App/Models/Truck");
const Company = use("App/Models/Company");
/**
 * Resourceful controller for interacting with trucks
 */
class TruckController {
  /**
   * Show a list of all trucks.
   * GET trucks
   */

  async createTruck({ auth, request, response, params: { id, values } }) {
    // id is the company id this driver belongs to
    //data is the values of new Driver
    const data = await request.post().values;
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const truck = await Truck.create({
      ...data,
      company_id: currentCompany.id
    });

    return truck;
  }

  async fetchTrucks({ auth, request, response }) {
    try {
      const currentCompany = await Company.query()
        .where({ id: auth.user.company_id })
        .first();

      const trucks = await Truck.query()
        .where({ company_id: currentCompany.id })
        .fetch();

      return trucks;
    } catch (error) {
      return [];
    }
  }

  async updateTruck({ auth, request, response }) {
    // id is the company id this driver belongs to
    //data is the values of new Driver
    const data = await request.post();

    const updateTruck = await Database.table("trucks")
      .where({ id: data.id })
      .update({
        ...data
      });

    return data;
  }

  async deleteTruck({ auth, request, response, params: { id } }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();
    const data = request.get().id;

    const truck = await Truck.find(data);

    try {
      let truckName = truck.truck_reference;
      await truck.delete();
      return { success: `Successfully deleted ${truckName}` };
    } catch (err) {
      return {
        error: "Failed, please try again or contact support"
      };
      console.log(err);
    }
  }
}

module.exports = TruckController;
