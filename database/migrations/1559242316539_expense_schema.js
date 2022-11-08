"use strict";

const Schema = use("Schema");

class ExpenseSchema extends Schema {
  up() {
    this.create("expenses", table => {
      table.increments();
      table
        .integer("truck_id")
        .unsigned()
        .references("id")
        .inTable("trucks")
        .onDelete("cascade");
      table
        .integer("trailer_id")
        .unsigned()
        .references("id")
        .inTable("trailers")
        .onDelete("cascade");

      table
        .integer("vendor_id")
        .unsigned()
        .references("id")
        .inTable("vendors")
        .onDelete("cascade");
      table
        .integer("category_expense_id")
        .unsigned()
        .references("id")
        .inTable("category_expenses")
        .onDelete("cascade");
      table
        .integer("category_expense_type_id")
        .unsigned()
        .references("id")
        .inTable("category_expense_types")
        .onDelete("cascade");
      table
        .integer("company_id")
        .unsigned()
        .references("id")
        .inTable("companies")
        .onDelete("cascade");
      table.string("amount", 254).notNullable();
      table.string("description", 254).nullable();
      table.string("date", 254).notNullable();
      table.string("expense_alert_days", 254).nullable();
      table.string("expense_attachment", 254).nullable();
      table.boolean("expense_alert").defaultTo(false);
      table.timestamps();
    });
  }

  down() {
    this.drop("expenses");
  }
}

module.exports = ExpenseSchema;
