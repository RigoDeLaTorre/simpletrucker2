"use strict";

const Model = use("Model");

class Company extends Model {
  //Each user has 1 company
  user() {
    return this.hasMany("App/Models/User");
  }
  //Each profile/company has many customers
  customers() {
    return this.hasMany("App/Models/Customer");
  }

  //Each Company has many loads
  loads() {
    return this.hasMany("App/Models/Load");
  }

  //Each Company has many drivers
  drivers() {
    return this.hasMany("App/Models/Driver");
  }
  vendors() {
    return this.hasMany("App/Models/Vendor");
  }
  categories() {
    return this.hasMany("App/Models/CategoryExpense");
  }
  expenseTypes() {
    return this.hasMany("App/Models/CategoryExpenseType");
  }
  attachments() {
    return this.hasMany("App/Models/Attachment");
  }
  subscription() {
    return this.hasMany("App/Models/Subscription");
  }
  checkout() {
    return this.hasMany("App/Models/Checkout");
  }
}

module.exports = Company;
