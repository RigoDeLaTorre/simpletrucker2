'use strict'
const ThemeOption = use('App/Models/ThemeOption')
/**
 * Resourceful controller for interacting with themeoptions
 */
class ThemeOptionController {
  async fetch({ auth, request, response, view }) {
    const themes = await ThemeOption.all()

    return themes
  }
}

module.exports = ThemeOptionController
