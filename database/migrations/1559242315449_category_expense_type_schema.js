"use strict";

const Schema = use("Schema");

class CategoryExpenseTypeSchema extends Schema {
  up() {
    this.create("category_expense_types", table => {
      table.increments();
      table
        .integer("category_expense_id")
        .unsigned()
        .references("id")
        .inTable("category_expenses")
        .onDelete("cascade");
      table.string("label", 254).notNullable();
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
    this.drop("category_expense_types");
  }
}

module.exports = CategoryExpenseTypeSchema;
