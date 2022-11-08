"use strict";

const Model = use("Model");

class Driver extends Model {
  //Each Driver belongs to one company
  company() {
    return this.belongsTo("App/Models/Company");
  }

  //Each Driver has many loads
  loads() {
    return this.hasMany("App/Models/Load");
  }
  user() {
    return this.hasOne('App/Models/User')
  }
}

module.exports = Driver;
