'use strict'

const Model = use('Model')

class CategoryExpense extends Model {

  company() {
    return this.belongsTo("App/Models/Company");
  }
  expenseTypes() {
    return this.hasMany("App/Models/CategoryExpenseType");
  }
  expenses() {
    return this.hasMany("App/Models/Expense");
  }


}

module.exports = CategoryExpense
