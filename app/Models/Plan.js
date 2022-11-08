'use strict'

const Model = use('Model')

class Plan extends Model {

  subscription() {
    return this.hasMany('App/Models/Subscription')
  }
}

module.exports = Plan
