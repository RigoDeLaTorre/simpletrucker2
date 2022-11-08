'use strict'

const Model = use('Model')

class UserSetting extends Model {
  user() {
    return this.hasOne('App/Models/User')
  }
  theme() {
    return this.belongsTo('App/Models/ThemeOption')
  }
}

module.exports = UserSetting
