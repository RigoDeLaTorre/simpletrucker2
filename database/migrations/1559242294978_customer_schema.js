"use strict";

const Schema = use("Schema");

class CustomersSchema extends Schema {
  up() {
    this.create("customers", table => {
      table.increments();
      table
        .integer("company_id")
        .unsigned()
        .references("id")
        .inTable("companies")
        .onDelete("cascade");
      table.string("customer_name", 254).notNullable();
      table.string("customer_address", 254).nullable();
      table.string("customer_city", 254).nullable();
      table.string("customer_state", 254).nullable();
      table.string("customer_zip", 254).nullable();
      table.string("customer_phone", 254).notNullable();
      table.string("customer_fax", 254).nullable();
      table.string("customer_email", 254).nullable();
      table.string("customer_bill_name", 254).notNullable();
      table.string("customer_bill_address", 254).nullable();
      table.string("customer_bill_city", 254).nullable();
      table.string("customer_bill_state", 254).nullable();
      table.string("customer_bill_zip", 254).nullable();
      table.string("customer_bill_phone", 254).notNullable();
      table.string("customer_bill_fax", 254).nullable();
      table.string("customer_bill_email", 254).nullable();
      table.string("process_type", 254).notNullable();
      table.string("quickpay_email", 254).nullable();
      table.string("quickpay_phone", 254).nullable();
      table.string("quickpay_fax", 254).nullable();
      table.string("quickpay_charge", 254).nullable();
      table.string("quickpay_notes", 254).nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("customers");
  }
}

module.exports = CustomersSchema;
