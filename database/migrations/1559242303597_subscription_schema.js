"use strict";

const Schema = use("Schema");

class SubscriptionSchema extends Schema {
  up() {
    this.create("subscriptions", table => {
      table.increments();
      table
        .integer("company_id")
        .unsigned()
        .references("id")
        .inTable("companies")
        .onDelete("cascade");
      table
        .integer("plan_id")
        .unsigned()
        .references("id")
        .inTable("plans")
        .onDelete("cascade");
      table.date("subscription_start_timestamp").notNullable();
      table.date("subscription_end_timestamp").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("subscriptions");
  }
}

module.exports = SubscriptionSchema;
