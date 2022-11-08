'use strict'

const Model = use('Model')

class Load extends Model {
  //Each Load has one company/profile
  company() {
    return this.belongsTo('App/Models/Company')
  }
  customer() {
    return this.belongsTo('App/Models/Customer')
  }

  // Each Load has one driver
  driver() {
    return this.belongsTo('App/Models/Driver')
  }

  //Each Load has many pickup locations
  pickups() {
    return this.hasMany('App/Models/Pickup')
  }

  //Each Load has many delivery locations
  deliveries() {
    return this.hasMany('App/Models/Delivery')
  }

  // Each Load has one driver
  truck() {
    return this.belongsTo('App/Models/Truck')
  }
  attachments() {
    return this.hasMany('App/Models/Attachment')
  }
}

module.exports = Load
