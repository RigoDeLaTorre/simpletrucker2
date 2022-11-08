const submitValidationVendors = values => {
  // Making all data to lowercase, ignoring id and company_id.
  let newValues = _.mapValues(values, function(val) {
    if (typeof val === "string") {
      return val.toLowerCase().trim();
    }
    if (_.isInteger(val)) {
      return val;
    }
  });

  // Capitalizing the state fields
  // newValues.customer_state = newValues.customer_state.toUpperCase();
  // newValues.customer_bill_state = newValues.customer_bill_state.toUpperCase();

  // Taking out the hypens in the phone/fax before inserting into database

  newValues.vendor_phone
    ? (newValues.vendor_phone = newValues.vendor_phone.split("-").join(""))
    : undefined;
  newValues.vendor_fax
    ? (newValues.vendor_fax = newValues.vendor_fax
        .split("-")
        .join(""))
    : undefined;


  newValues.vendor_state =  values.vendor_state ? values.vendor_state.value: newValues.vendor_state


  return newValues;
};

export { submitValidationVendors };
