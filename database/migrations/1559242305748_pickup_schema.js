"use strict";

const Schema = use("Schema");

class PickupSchema extends Schema {
  up() {
    this.create("pickups", table => {
      table.increments();
      table.string("pickup_date", 254).notNullable();
      table.string("pickup_name", 254).nullable();
      table.string("pickup_address", 254).nullable();
      table.string("pickup_city", 254).notNullable();
      table.string("pickup_state", 254).notNullable();
      table.string("pickup_zipcode", 254).nullable();
      table.string("pickup_po_number", 254).nullable();
      table
        .integer("load_id")
        .unsigned()
        .references("id")
        .inTable("loads")
        .onDelete("cascade");
      table.timestamps();
    });
  }

  down() {
    this.drop("pickups");
  }
}

module.exports = PickupSchema;
