"use strict";

const Schema = use("Schema");

class TrailersSchema extends Schema {
  up() {
    this.create("trailers", table => {
      table.increments();
      table.string("trailer_year", 254).nullable();
      table.string("trailer_manufacturer", 254).nullable();
      table.string("trailer_model", 254).nullable();
      table.string("trailer_reference", 254).notNullable();
      table.string("trailer_vin", 254).nullable();
      table.string("trailer_license", 254).nullable();
      table.string("trailer_date_aquired", 254).nullable();
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
    this.drop("trailers");
  }
}

module.exports = TrailersSchema;
