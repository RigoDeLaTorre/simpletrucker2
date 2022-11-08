"use strict";

const Model = use("Model");

class Customer extends Model {
  //Each Customer has one company
  company() {
    return this.belongsTo("App/Models/Company");
  }

  //Each Customer has many loads.
  loads() {
    return this.hasMany("App/Models/Load");
  }
}

module.exports = Customer;
