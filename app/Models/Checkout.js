'use strict'

const Model = use('Model')

class Checkout extends Model {
  user() {
    return this.belongsTo('App/Models/User')
  }
  company() {
    return this.belongsTo('App/Models/Company')
  }
}

module.exports = Checkout
