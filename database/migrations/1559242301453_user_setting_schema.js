"use strict";

const Schema = use("Schema");

class UserSettingSchema extends Schema {
  up() {
    this.create("user_settings", table => {
      table.increments();
      table
        .string("theme", 254)
        .defaultTo("themeDark")
        .nullable();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("cascade");
      table
        .integer("theme_option_id")
        .unsigned()
        .references("id")
        .inTable("theme_options")
        .onDelete("cascade");
      // .inTable('theme_options').defaultTo(1)
      table.timestamps();
    });
  }

  down() {
    this.drop("user_settings");
  }
}

module.exports = UserSettingSchema;
