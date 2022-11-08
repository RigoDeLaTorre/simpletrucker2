"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class UserSchema extends Schema {
  up() {
    this.create("users", table => {
      table.increments();
      table
        .string("email", 254)
        .notNullable()
        .unique();
      table.string("password", 60).notNullable();
      table.string("first_name", 254).notNullable();
      table.string("last_name", 254).notNullable();
      table
        .integer("past_credits")
        .defaultTo(0)
        .unsigned()
        .nullable();
      table
        .integer("user_role_id")
        .unsigned()
        .references("id")
        .inTable("user_roles")
        .defaultTo(22)
        .onDelete("cascade");
      table
        .integer("company_id")
        .unsigned()
        .references("id")
        .inTable("companies")

        .onDelete("cascade");
      table
        .integer("driver_id")
        .unsigned()
        .references("id")
        .inTable("drivers")

        .onDelete("cascade");
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
