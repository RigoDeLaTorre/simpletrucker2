"use strict";
const Database = use("Database");
const Trailer = use("App/Models/Trailer");
const Company = use("App/Models/Company");
/**
 * Resourceful controller for interacting with trailers
 */
class TrailerController {
  async createTrailer({ auth, request, response, params: { id, values } }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const data = await request.post().values;

    const trailer = await Trailer.create({
      ...data,
      company_id: currentCompany.id
    });

    return trailer;
  }

  async fetchTrailers({ auth, request, response }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const trailers = await Trailer.query()
      .where({ company_id: currentCompany.id })
      .fetch();

    return trailers;
  }

  async updateTrailer({ auth, request, response }) {
    // id is the company id this driver belongs to
    //data is the values of new Driver
    const data = await request.post();
    console.log(data);
    const updateTrailer = await Database.table("trailers")
      .where({ id: data.id })
      .update({
        ...data
      });

    return data;
  }

  async deleteTrailer({ auth, request, response, params: { id } }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();
    const data = request.get().id;

    const trailer = await Trailer.find(data);

    try {
      let trailerName = trailer.trailer_reference;
      await trailer.delete();
      return { success: `Successfully deleted ${trailerName}` };
    } catch (err) {
      return {
        error: "Failed, please try again or contact support"
      };
      console.log(err);
    }
  }
}

module.exports = TrailerController;
