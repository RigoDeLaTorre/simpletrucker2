"use strict";

const Schema = use("Schema");

class LoadsSchema extends Schema {
  up() {
    this.create("loads", table => {
      table.increments();
      table
        .integer("customer_id")
        .unsigned()
        .references("id")
        .inTable("customers")
        .onDelete("cascade");
      table
        .integer("invoice_id")
        .unsigned()
        .notNullable();
      table.string("load_reference", 254).notNullable();
      table
        .decimal("rate_confirmation_amount")
        .notNullable()
        .defaultTo(0);
      table.string("rate_confirmation_pdf", 254).nullable();
      table.text("load_notes").nullable();
      table.text("invoice_notes").nullable();
      table
        .decimal("load_reimbursement")
        .defaultTo(0)
        .notNullable();
      table
        .decimal("load_deduction")
        .defaultTo(0)
        .notNullable();
      table
        .decimal("other_deduction")
        .defaultTo(0)
        .notNullable();
      table
        .decimal("other_reimbursement")
        .defaultTo(0)
        .notNullable();
      table
        .integer("company_id")
        .unsigned()
        .references("id")
        .inTable("companies");
      table
        .integer("driver_id")
        .unsigned()
        .references("id")
        .inTable("drivers")
        .onDelete("cascade");
      table.string("load_status").defaultTo("active");

      table
        .decimal("customer_paid_amount")
        .notNullable()
        .defaultTo(0);
      table.string("customer_paid_date").nullable();

      table
        .decimal("customer_quickpay_fee")
        .notNullable()
        .defaultTo(0);

      table
        .decimal("factor_fee_percentage")
        .notNullable()
        .defaultTo(0);
      table
        .decimal("factor_fee_amount")
        .notNullable()
        .defaultTo(0);
      table
        .decimal("factor_fee_other")
        .notNullable()
        .defaultTo(0);
      table
        .decimal("factor_total_advanced")
        .notNullable()
        .defaultTo(0);
      table.string("factor_paid_date").nullable();

      table
        .decimal("factor_reserve_percentage")
        .defaultTo(0)
        .notNullable();
      table
        .decimal("factor_reserve_held")
        .defaultTo(0)
        .notNullable();

      table
        .decimal("factor_reserve_amount_paid")
        .defaultTo(0)
        .notNullable();
      table.string("factor_reserve_amount_paid_date").nullable();
      table.string("factor_company_name").nullable();

      table
        .boolean("fuel_advance_from")
        .defaultTo(0)
        .notNullable();

      table
        .decimal("fuel_advance_amount")
        .defaultTo(0)
        .notNullable();

      table
        .decimal("fuel_advance_fee")
        .defaultTo(0)
        .notNullable();
      table.string("fuel_advance_date").nullable();

      table
        .decimal("driver_paid_amount")
        .defaultTo(0)
        .notNullable();

      table.string("driver_paid_date").nullable();
      table.string("driver_paid_type").nullable();
      table.string("driver_paid_reference").nullable();
      table.boolean("load_processed").defaultTo(false);
      table.string("load_processed_type").nullable();
      table.string("load_processed_date").nullable();
      table.boolean("bill_of_lading").defaultTo(false);
      table.string("bill_of_lading_number", 254).nullable();
      table.string("bill_of_lading_pdf", 254).nullable();
      table.integer("load_mileage").nullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("loads");
  }
}

module.exports = LoadsSchema;
