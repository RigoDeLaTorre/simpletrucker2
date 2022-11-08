import _ from "lodash";
import moment from "moment";
const submitValidationAccounting = (
  {
    id,
    invoice_id,
    company_id,
    customer_id,
    load_reference,
    rate_confirmation_amount,
    driver_id,
    load_notes,
    invoice_notes,
    load_reimbursement,
    load_deduction,
    load_processed_type,
    bill_of_lading,
    bill_of_lading_number,
    rate_confirmation_pdf,
    bill_of_lading_pdf,
    fuel_advance_fee,
    fuel_advance_amount,
    fuel_advance_date,
    customer_quickpay_fee,
    customer_paid_date,
    factor_fee_amount,
    factor_fee_other,
    factor_total_advanced,
    factor_paid_date,
    factor_reserve_held,
    factor_reserve_amount_paid,
    deliveries,
    pickups
  },
  page
) => {
  rate_confirmation_amount = parseFloat(rate_confirmation_amount).toFixed(2);
  load_reimbursement = parseFloat(load_reimbursement).toFixed(2);
  load_deduction = parseFloat(load_deduction).toFixed(2);
  bill_of_lading_number ? bill_of_lading_number.trim() : undefined;
  invoice_notes ? (invoice_notes = invoice_notes.trim()) : undefined;
  load_notes ? (load_notes = load_notes.trim()) : undefined;

  if (load_processed_type !== null) {
    load_processed_type =
      typeof load_processed_type === "object"
        ? load_processed_type.value
        : load_processed_type;
  }

  bill_of_lading =
    typeof bill_of_lading === "object"
      ? parseInt(bill_of_lading.value)
      : bill_of_lading;
  driver_id = typeof driver_id === "object" ? driver_id.value : driver_id;
  customer_id =
    typeof customer_id === "object" ? customer_id.value : customer_id;

  let newPickups = _.forEach(pickups, function(item) {
    for (let name in item) {
      if (name == "pickup_state" && typeof item[name] === "object") {
        item[name] = item[name].value;
      } else if (name == "pickup_state" && typeof name === "string") {
      } else if (name == "pickup_date") {
        item[name] = moment.utc(item[name]).format();
      } else if (
        typeof item[name] === "string" &&
        item[name] != "pickup_date"
      ) {
        item[name] = item[name].toLowerCase().trim();
      }
    }

    return pickups;
  });

  let newDeliveries = _.forEach(deliveries, function(item) {
    for (let name in item) {
      if (name == "delivery_state" && typeof item[name] === "object") {
        item[name] = item[name].value;
      } else if (name == "delivery_state" && typeof name === "string") {
      } else if (name == "delivery_date") {
        item[name] = moment.utc(item[name]).format();
      } else if (
        typeof item[name] === "string" &&
        item[name] != "delivery_date"
      ) {
        item[name] = item[name].toLowerCase().trim();
      }
    }

    return deliveries;
  });

  if (page === "accounting") {
    let newValues = {
      id,
      invoice_id,
      company_id,
      customer_id,
      load_reference,
      rate_confirmation_amount,
      driver_id,
      load_notes,
      invoice_notes,
      load_reimbursement,
      load_deduction,
      load_processed_type,
      bill_of_lading,
      bill_of_lading_number,
      rate_confirmation_pdf,
      bill_of_lading_pdf,
      fuel_advance_fee,
      fuel_advance_amount,
      fuel_advance_date,
      customer_quickpay_fee,
      customer_paid_date,
      factor_fee_amount,
      factor_fee_other,
      factor_total_advanced,
      factor_paid_date,
      factor_reserve_held,
      factor_reserve_amount_paid,
      deliveries: newDeliveries,
      pickups: newPickups
    };
    console.log("weeeeee", newValues);
    return newValues;
  } else if (page === "editload") {
    let newValues = {
      company_id,
      customer_id,
      driver_id,
      id,
      invoice_id,
      load_reference,
      rate_confirmation_amount,
      load_notes,
      invoice_notes,
      deliveries: newDeliveries,
      pickups: newPickups
    };
    return newValues;
  } else if (page === "addnewload") {
    let newValues = {
      customer_id,
      driver_id,
      load_reference,
      rate_confirmation_amount,
      load_notes,
      invoice_notes,
      deliveries: newDeliveries,
      pickups: newPickups
    };
    return newValues;
  }
};

export { submitValidationAccounting };
