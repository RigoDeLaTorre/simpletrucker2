"use strict";

const Schema = use("Schema");

class CheckoutSchema extends Schema {
  up() {
    this.create("checkouts", table => {
      table.increments();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("cascade");
      table
        .integer("company_id")
        .unsigned()
        .references("id")
        .inTable("companies")
        .onDelete("cascade");
      table.string("charge_id", 254).nullable();
      table.string("amount", 254).nullable();
      table.string("amount_refunded", 254).nullable();
      table.string("balance_transaction", 254).nullable();
      table.string("captured", 254).nullable();
      table.string("currency", 254).nullable();
      table.string("fingerprint", 254).nullable();
      table.string("description", 254).nullable();
      table.string("payment_method", 254).nullable();
      table.string("transaction_id", 254).nullable();
      table.string("card_cvc_check", 254).nullable();
      table.string("card_zip", 254).nullable();
      table.string("card_number", 254).nullable();
      table.string("card_email", 254).nullable();
      table.string("card_charge_date", 254).nullable();
      table.string("status", 254).nullable();
      table.string("charge_created", 254).nullable();
      table.string("paid", 254).nullable();
      table.boolean("credited_to_user").defaultTo(true);

      table.timestamps();
    });
  }

  down() {
    this.drop("checkouts");
  }
}

module.exports = CheckoutSchema;
