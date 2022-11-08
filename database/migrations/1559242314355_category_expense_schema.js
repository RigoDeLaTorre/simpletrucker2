"use strict";

const Schema = use("Schema");

class CategoryExpenseSchema extends Schema {
  up() {
    this.create("category_expenses", table => {
      table.increments();
      table
        .integer("company_id")
        .unsigned()
        .references("id")
        .inTable("companies")
        .onDelete("cascade");
      table.string("label", 254).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("category_expenses");
  }
}

module.exports = CategoryExpenseSchema;
