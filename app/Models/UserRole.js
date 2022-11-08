'use strict'

const Model = use('Model')

class UserRole extends Model {

  user() {
    return this.hasMany('App/Models/User')
  }
}

module.exports = UserRole
