const submitValidationCustomer = values => {
  // Making all data to lowercase, ignoring id and company_id.
  console.log("valllues", values);
  let newValues = _.mapValues(values, function(val, obj) {
    if (val == null) {
      return val;
    } else if (typeof val === "object") {
      return val.value;
    } else if (typeof val === "string") {
      if (
        obj === "customer_phone" ||
        obj === "customer_bill_phone" ||
        obj === "customer_fax" ||
        obj === "customer_bill_fax" ||
        obj === "quickpay_phone" ||
        obj === "quickpay_fax"
      ) {
        return val.split("-").join("");
      } else {
        return val.toLowerCase().trim();
      }
    } else if (_.isInteger(val)) {
      return val;
    }
  });

  return newValues;
};

export { submitValidationCustomer };
