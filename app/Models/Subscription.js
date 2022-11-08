'use strict'

const Model = use('Model')

class Subscription extends Model {
  plan() {
    return this.belongsTo('App/Models/Plan')
  }
  company() {
    return this.belongsTo('App/Models/Company')
  }
}

module.exports = Subscription
