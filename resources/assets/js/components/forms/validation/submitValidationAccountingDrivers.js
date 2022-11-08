const submitValidationAccountingDrivers = values => {


  let newValues = _.mapValues(values, function(val) {
    if (typeof val === "string") {
      return val.toLowerCase().trim();
    }
    if (_.isInteger(val)) {
      return val;
    }
  });



}
