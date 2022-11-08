'use strict'

const Model = use('Model')

class CategoryExpenseType extends Model {
  company() {
    return this.belongsTo("App/Models/Company");
  }

  category() {
    return this.belongsTo("App/Models/CategoryExpense");
  }

  expenses() {
    return this.hasMany("App/Models/Expense");
  }




}

module.exports = CategoryExpenseType
