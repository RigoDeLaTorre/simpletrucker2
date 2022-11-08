"use strict";

const Model = use("Model");

class Delivery extends Model {
  //Each Delivery belongs to a load
  loads() {
    return this.belongsTo("App/Models/Load");
  }
}

module.exports = Delivery;
