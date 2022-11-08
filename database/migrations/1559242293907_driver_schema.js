"use strict";

const Schema = use("Schema");

class DriverSchema extends Schema {
  up() {
    this.create("drivers", table => {
      table.increments();
      table.string("driver_first_name", 254).notNullable();
      table.string("driver_last_name", 254).notNullable();
      table.string("driver_address", 254).notNullable();
      table.string("driver_city", 254).notNullable();
      table.string("driver_state", 254).notNullable();
      table.string("driver_zip", 254).notNullable();
      table.string("driver_phone", 254).notNullable();
      table.string("driver_email", 254).nullable();
      table.string("driver_pay_amount", 254).notNullable();
      table.string("driver_hire_date", 254).notNullable();
      table.string("driver_license_number", 254).notNullable();
      table.string("driver_license_expiration", 254).notNullable();
      table.boolean("user_access").defaultTo(0);
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
    this.drop("drivers");
  }
}

module.exports = DriverSchema;
