'use strict'
const UserSetting = use('App/Models/UserSetting')
const Database = use('Database')
/**
 * Resourceful controller for interacting with usersettings
 */
class UserSettingController {
  /**
   * Show a list of all usersettings.
   * GET usersettings
   */

  async fetch({ auth, request, response, view }) {
    const settings = await UserSetting.query()
      .where('user_id', '=', auth.user.id)
      .with('theme')
      .first()

    return settings
  }
  async index({ request, response, view }) {}

  async create({ request, response, view }) {}

  async store({ request, response }) {}

  async show({ params, request, response, view }) {}

  async edit({ params, request, response, view }) {}

  async update({ auth, request, response }) {
    const data = await request.only('theme_option_id')

    const updateSettings = await Database.table('user_settings')
      .where({ user_id: auth.user.id })
      .update({
        ...data
      })
    const newSettings = await UserSetting.query()
      .where({ user_id: auth.user.id })
      .with('theme')
      .first()

    return newSettings

    // const settings = await UserSetting.query()
    //   .where('user_id', '=', auth.user.id)
    //   .first()
  }

  async destroy({ params, request, response }) {}
}

module.exports = UserSettingController
