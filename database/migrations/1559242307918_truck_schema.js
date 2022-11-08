"use strict";

const Schema = use("Schema");

class TrucksSchema extends Schema {
  up() {
    this.create("trucks", table => {
      table.increments();
      table.string("truck_year", 254).nullable();
      table.string("truck_manufacturer", 254).nullable();
      table.string("truck_model", 254).nullable();
      table.string("truck_reference", 254).notNullable();
      table.string("truck_vin", 254).nullable();
      table.string("truck_license", 254).nullable();
      table.string("truck_date_aquired", 254).nullable();
      table.string("truck_initial_odometer", 254).nullable();
      table
        .integer("company_id")
        .unsigned()
        .references("id")
        .inTable("companies")
        .onDelete("cascade");
      table.timestamps();
    });
  }

  down() {
    this.drop("trucks");
  }
}

module.exports = TrucksSchema;
