'use strict'

/**
 * Resourceful controller for interacting with plans
 */
class PlanController {
  /**
   * Show a list of all plans.
   * GET plans
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new plan.
   * GET plans/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new plan.
   * POST plans
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single plan.
   * GET plans/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing plan.
   * GET plans/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update plan details.
   * PUT or PATCH plans/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a plan with id.
   * DELETE plans/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = PlanController
