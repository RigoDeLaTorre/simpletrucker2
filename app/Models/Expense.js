'use strict'

const Model = use('Model')

class Expense extends Model {
  truck() {
    return this.belongsTo('App/Models/Truck')
  }
  trailer() {
    return this.belongsTo('App/Models/Trailer')
  }
  vendor() {
    return this.belongsTo('App/Models/Vendor')
  }
  expenseType() {
    return this.belongsTo('App/Models/CategoryExpenseType')
  }
  expenseCategory() {
    return this.belongsTo('App/Models/CategoryExpense')
  }
  attachments() {
    return this.hasMany('App/Models/Attachment')
  }
}

module.exports = Expense
