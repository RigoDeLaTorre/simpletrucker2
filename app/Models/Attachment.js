'use strict'

const Model = use('Model')

class Attachment extends Model {
  load() {
    return this.belongsTo('App/Models/Load')
  }
  company() {
    return this.belongsTo('App/Models/Company')
  }
  truck() {
    return this.belongsTo('App/Models/Truck')
  }
  trailer() {
    return this.belongsTo('App/Models/Trailer')
  }
  expense() {
    return this.belongsTo('App/Models/Expense')
  }
}

module.exports = Attachment
