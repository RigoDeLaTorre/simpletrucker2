'use strict'

/**
 * Resourceful controller for interacting with deliveries
 */
class DeliveryController {
  /**
   * Show a list of all deliveries.
   * GET deliveries
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new delivery.
   * GET deliveries/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new delivery.
   * POST deliveries
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single delivery.
   * GET deliveries/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing delivery.
   * GET deliveries/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update delivery details.
   * PUT or PATCH deliveries/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a delivery with id.
   * DELETE deliveries/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = DeliveryController
