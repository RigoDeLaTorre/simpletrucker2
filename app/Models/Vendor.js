'use strict'

const Model = use('Model')

class Vendor extends Model {

  expenses(){
      return this.hasMany("App/Models/Expense");
  }
  company() {
    return this.belongsTo("App/Models/Company");
  }
  

}

module.exports = Vendor
