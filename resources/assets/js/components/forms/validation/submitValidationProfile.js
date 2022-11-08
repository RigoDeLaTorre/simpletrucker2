const submitValidationProfile = values => {

  let newValues = _.mapValues(values, function(val,obj) {
    if (val == null) {
      return val
    }
    else if (typeof val === "object") {

      return val.value;
    } else if (typeof val === "string") {

      if (
        obj === "company_phone" ||
        obj === "company_bill_phone" ||
        obj === "company_fax" ||
        obj === "company_bill_fax" ||
        obj === "factory_company_phone" ||
        obj === "factory_company_fax" ||
        obj === "factory_company_rep_phone" ||
        obj === "factory_company_rep_fax"
      ) {
        return val.split("-").join("")
      }else{
        return val.toLowerCase().trim();
      }
    }else if (_.isInteger(val)) {
      return val;
    }
  });

  newValues.invoice_starting_id = parseInt(newValues.invoice_starting_id);

  return newValues;
};

const errorReduxFactoryCompany = object => {
  return Object.keys(object).some(
    x =>
      x === "factory_company_name" ||
      x === "factory_company_address" ||
      x === "factory_company_city" ||
      x === "factory_company_state" ||
      x === "factory_company_zip" ||
      x === "factory_company_phone" ||
      x === "factory_company_fax" ||
      x === "factory_company_email" ||
      x === "factory_company_process_fee" ||
      x === "factory_company_reserve_fee" ||
      x === "factory_company_notes"
  );
};

const errorReduxFactoryCompanyAgent = object => {
  return Object.keys(object).some(
    x =>
      x === "factory_company_rep_name" ||
      x === "factory_company_rep_phone" ||
      x === "factory_company_rep_fax" ||
      x === "factory_company_rep_email"
  );
};

const errorsReduxProfile = object => {
  return Object.keys(object).some(
    x =>
      x === "company_name" ||
      x === "company_address" ||
      x === "company_city" ||
      x === "company_state" ||
      x === "company_zip" ||
      x === "company_phone" ||
      x === "company_fax" ||
      x === "company_email"
  );
};

const errorReduxBilling = object => {
  return Object.keys(object).some(
    x =>
      x === "company_bill_name" ||
      x === "company_bill_address" ||
      x === "company_bill_city" ||
      x === "company_bill_state" ||
      x === "company_bill_zip" ||
      x === "company_bill_phone" ||
      x === "company_bill_fax" ||
      x === "company_bill_email"
  );
};

export {
  submitValidationProfile,
  errorReduxFactoryCompany,
  errorReduxFactoryCompanyAgent,
  errorsReduxProfile,
  errorReduxBilling
};
