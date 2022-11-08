const submitValidationExpense = (values, type) => {
  let newValues = { ...values };

  values.description
    ? (newValues.description = newValues.description.trim())
    : null;
  //expense category

  newValues.category_expense_id
    ? (newValues.category_expense_id = newValues.category_expense_id.value)
    : null;
  //expense sub category

  console.log("before type ", newValues.category_expense_type_id);
  newValues.category_expense_type_id &&
  newValues.category_expense_type_id.value !== ""
    ? (newValues.category_expense_type_id =
        newValues.category_expense_type_id.value)
    : (newValues.category_expense_type_id = null);

  console.log("after type ", newValues.category_expense_type_id);
  //alert on or off
  newValues.expense_alert
    ? (newValues.expense_alert = newValues.expense_alert.value)
    : null;

  if (newValues.vendor_id && newValues.vendor_id.value !== "") {
    newValues.vendor_id = newValues.vendor_id.value;
  } else if (newValues.vendor_id && newValues.vendor_id.value === "") {
    newValues.vendor_id = null;
  }
  delete newValues.vendor;
  if (type === "truck_id") {
    newValues.truck_id = newValues.truck_id.value;
    newValues.trailer_id = null;
  }
  if (type === "trailer_id") {
    newValues.trailer_id = newValues.truck_id.value;
    newValues.truck_id = null;
  }
  if (type == "general_expense_id") {
    newValues.truck_id = null;
    newValues.trailer_id = null;
  }

  if (newValues.expenseType || newValues.expenseType === null) {
    delete newValues.expenseType;
  }
  if (newValues.expenseCategory) {
    delete newValues.expenseCategory;
  }
  if (newValues.trailer || newValues.trailer === null) {
    delete newValues.trailer;
  }
  if (newValues.truck || newValues.truck === null) {
    delete newValues.truck;
  }
  if (newValues.attachments || newValues.attachments === null) {
    delete newValues.attachments;
  }

  return newValues;
};
export { submitValidationExpense };
