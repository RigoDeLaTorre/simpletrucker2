"use strict";

const Model = use("Model");

class Pickup extends Model {
  //Each Pickup belongs to a load
  loads() {
    return this.belongsTo("App/Models/Load");
  }
}

module.exports = Pickup;
