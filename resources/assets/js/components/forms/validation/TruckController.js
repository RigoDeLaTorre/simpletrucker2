'use strict'
const Database = use('Database')
const Truck = use('App/Models/Truck')
const Company = use('App/Models/Company')
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
    const data = await request.post().values
    const company = await request.post().id

    const truck = await Truck.create({
      ...data,
      company_id: company
    })

    return truck
  }

  async fetchTrucks({ auth, request, response }) {
    try {
      const currentCompany = await Company.query()
        .where({ user_id: auth.user.id })
        .first()

      const trucks = await Truck.query()
        .where({ company_id: currentCompany.id })
        .fetch()

      return trucks
    } catch (error) {
      return []
    }
  }

  async updateTruck({ auth, request, response }) {
    // id is the company id this driver belongs to
    //data is the values of new Driver
    const data = await request.post()

    const updateTruck = await Database.table('trucks')
      .where({ id: data.id })
      .update({
        ...data
      })

    return data
  }

  async create({ request, response, view }) {}

  /**
   * Create/save a new truck.
   * POST trucks
   */
  async store({ request, response }) {}

  /**
   * Display a single truck.
   * GET trucks/:id
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing truck.
   * GET trucks/:id/edit
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update truck details.
   * PUT or PATCH trucks/:id
   */
  async update({ params, request, response }) {}

  /**
   * Delete a truck with id.
   * DELETE trucks/:id
   */
  async destroy({ params, request, response }) {}
}

module.exports = TruckController
