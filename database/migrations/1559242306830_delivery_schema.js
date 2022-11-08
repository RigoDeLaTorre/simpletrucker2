"use strict";

const Schema = use("Schema");

class DeliverySchema extends Schema {
  up() {
    this.create("deliveries", table => {
      table.increments();
      table.string("delivery_date", 254).notNullable();
      table.string("delivery_name", 254).nullable();
      table.string("delivery_address", 254).nullable();
      table.string("delivery_city", 254).notNullable();
      table.string("delivery_state", 254).notNullable();
      table.string("delivery_zipcode", 254).nullable();
      table.string("delivery_po_number", 254).nullable();
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
    this.drop("deliveries");
  }
}

module.exports = DeliverySchema;
