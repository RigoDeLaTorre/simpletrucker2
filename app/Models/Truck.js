'use strict'

const Model = use('Model')

class Truck extends Model {
  company() {
    return this.belongsTo('App/Models/Company')
  }

  //Each Truck has many loads
  loads() {
    return this.hasMany('App/Models/Load')
  }
  truckexpense() {
    return this.hasMany('App/Models/Truckexpense')
  }
  inspections() {
    return this.hasMany('App/Models/Inspection')
  }
  expense() {
    return this.hasMany('App/Models/Expense')
  }
  attachments() {
    return this.hasMany('App/Models/Attachment')
  }
}

module.exports = Truck
