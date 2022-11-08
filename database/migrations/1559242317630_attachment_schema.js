"use strict";

const Schema = use("Schema");

class AttachmentSchema extends Schema {
  up() {
    this.create("attachments", table => {
      table.increments();
      table.string("attachment", 254).nullable();
      table
        .integer("load_id")
        .unsigned()
        .references("id")
        .inTable("loads")
        .onDelete("cascade");
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
        .integer("expense_id")
        .unsigned()
        .references("id")
        .inTable("expenses")
        .onDelete("cascade");
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
    this.drop("attachments");
  }
}

module.exports = AttachmentSchema;
