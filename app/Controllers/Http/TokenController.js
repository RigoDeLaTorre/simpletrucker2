'use strict'

/**
 * Resourceful controller for interacting with tokens
 */
class TokenController {
  /**
   * Show a list of all tokens.
   * GET tokens
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new token.
   * GET tokens/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new token.
   * POST tokens
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single token.
   * GET tokens/:id
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing token.
   * GET tokens/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update token details.
   * PUT or PATCH tokens/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a token with id.
   * DELETE tokens/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = TokenController
