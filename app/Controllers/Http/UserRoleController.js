'use strict'

/**
 * Resourceful controller for interacting with userroles
 */
class UserRoleController {
  /**
   * Show a list of all userroles.
   * GET userroles
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new userrole.
   * GET userroles/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new userrole.
   * POST userroles
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single userrole.
   * GET userroles/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing userrole.
   * GET userroles/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update userrole details.
   * PUT or PATCH userroles/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a userrole with id.
   * DELETE userroles/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = UserRoleController
