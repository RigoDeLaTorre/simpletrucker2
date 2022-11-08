'use strict'

const Model = use('Model')

class ThemeOption extends Model {
  users() {
    return this.hasMany('App/Models/User')
  }
  setting() {
    return this.hasMany('App/Models/UserSetting')
  }
}

module.exports = ThemeOption
