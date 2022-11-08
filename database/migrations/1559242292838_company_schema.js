"use strict";

const Schema = use("Schema");

class CompanySchema extends Schema {
  up() {
    this.create("companies", table => {
      table.increments();
      // table
      //   .integer("user_id")
      //   .unsigned()
      //   .references("id")
      //   .inTable("users");
      table
        .integer("invoice_starting_id")
        .unsigned()
        .notNullable();
      table
        .integer("credits")
        .defaultTo(0)
        .unsigned();
      table.string("company_name", 254).nullable();
      table.string("company_address", 254).nullable();
      table.string("company_city", 254).nullable();
      table.string("company_state", 2).nullable();
      table.string("company_zip", 10).nullable();
      table.string("company_phone", 10).nullable();
      table.string("company_fax", 10).nullable();
      table.string("company_email", 254).nullable();
      table.string("company_bill_name", 254).notNullable();
      table.string("company_bill_address", 254).notNullable();
      table.string("company_bill_city", 254).notNullable();
      table.string("company_bill_state", 2).notNullable();
      table.string("company_bill_zip", 10).notNullable();
      table.string("company_bill_phone", 10).notNullable();
      table.string("company_bill_fax", 10).nullable();
      table.string("company_bill_email", 254).nullable();
      table.string("factory_company_name", 254).nullable();
      table.string("factory_company_address", 254).nullable();
      table.string("factory_company_city", 254).nullable();
      table.string("factory_company_state", 2).nullable();
      table.string("factory_company_zip", 10).nullable();
      table.string("factory_company_phone", 10).nullable();
      table.string("factory_company_fax", 10).nullable();
      table.string("factory_company_email", 254).nullable();
      table.string("factory_company_process_fee", 10).nullable();
      table.string("factory_company_reserve_fee", 10).nullable();
      table.string("factory_company_notes", 254).nullable();
      table.string("factory_company_rep_name", 10).nullable();
      table.string("factory_company_rep_email", 254).nullable();
      table.string("factory_company_rep_phone", 10).nullable();
      table.string("factory_company_rep_fax", 254).nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("companies");
  }
}

module.exports = CompanySchema;
