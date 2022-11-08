'use strict'

/**
 * Resourceful controller for interacting with subscriptions
 */
class SubscriptionController {
  /**
   * Show a list of all subscriptions.
   * GET subscriptions
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new subscription.
   * GET subscriptions/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new subscription.
   * POST subscriptions
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single subscription.
   * GET subscriptions/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing subscription.
   * GET subscriptions/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update subscription details.
   * PUT or PATCH subscriptions/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a subscription with id.
   * DELETE subscriptions/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = SubscriptionController
