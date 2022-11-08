'use strict'

const Model = use('Model')

class Trailer extends Model {
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
  attachments() {
    return this.hasMany('App/Models/Attachment')
  }
}

module.exports = Trailer
