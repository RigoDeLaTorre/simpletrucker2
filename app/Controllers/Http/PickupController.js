'use strict'

/**
 * Resourceful controller for interacting with pickups
 */
class PickupController {
  /**
   * Show a list of all pickups.
   * GET pickups
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new pickup.
   * GET pickups/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new pickup.
   * POST pickups
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single pickup.
   * GET pickups/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing pickup.
   * GET pickups/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update pickup details.
   * PUT or PATCH pickups/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a pickup with id.
   * DELETE pickups/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = PickupController
