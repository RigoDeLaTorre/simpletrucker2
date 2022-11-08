'use strict'
const Company = use('App/Models/Company')
const Purchase = use('App/Models/Checkout')
/**
 * Resourceful controller for interacting with checkouts
 */
class CheckoutController {
  /**
   * Show a list of all checkouts.
   * GET checkouts
   */
  async fetchPurchases({ auth, request, response, view }) {
    try {
      const purchaseList = await Purchase.query()
        .with('user', builder => {
          builder.select(['id', 'first_name', 'last_name'])
        })
        .where({ company_id: auth.user.company_id })
        .fetch()

      return purchaseList
    } catch (error) {}
  }

  /**
   * Render a form to be used for creating a new checkout.
   * GET checkouts/create
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new checkout.
   * POST checkouts
   */
  async store({ request, response }) {}

  /**
   * Display a single checkout.
   * GET checkouts/:id
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing checkout.
   * GET checkouts/:id/edit
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update checkout details.
   * PUT or PATCH checkouts/:id
   */
  async update({ params, request, response }) {}

  /**
   * Delete a checkout with id.
   * DELETE checkouts/:id
   */
  async destroy({ params, request, response }) {}
}

module.exports = CheckoutController
