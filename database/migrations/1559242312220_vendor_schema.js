"use strict";

const Schema = use("Schema");

class VendorSchema extends Schema {
  up() {
    this.create("vendors", table => {
      table.increments();
      table
        .integer("company_id")
        .unsigned()
        .references("id")
        .inTable("companies")
        .onDelete("cascade");
      table.string("vendor_name", 254).notNullable();
      table.string("vendor_address", 254).nullable();
      table.string("vendor_city", 254).nullable();
      table.string("vendor_state", 254).nullable();
      table.string("vendor_zipcode", 254).nullable();
      table.string("vendor_phone", 254).nullable();
      table.string("vendor_fax", 254).nullable();
      table.string("vendor_email", 254).nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("vendors");
  }
}

module.exports = VendorSchema;
