"use strict";
const Expense = use("App/Models/Expense");
const Company = use("App/Models/Company");
const Database = use("Database");
/**
 * Resourceful controller for interacting with expenses
 */
class ExpenseController {
  async createExpenseRecord({ auth, request, response }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const data = await request.post();

    const expenseRecord = await Expense.create({
      ...data,
      company_id: currentCompany.id
    });

    const expenseRecordReturn = await Expense.query()
      .with("expenseCategory", builder => {
        builder.select(["id", "label"]);
      })
      .with("expenseType", builder => {
        builder.select(["id", "label"]);
      })
      .with("vendor", builder => {
        builder.select(["id", "vendor_name"]);
      })
      .with("truck", builder => {
        builder.select(["id", "truck_reference"]);
      })
      .with("trailer", builder => {
        builder.select(["id", "trailer_reference"]);
      })
      .with("attachments")
      .where({ id: expenseRecord.id })
      .first();

    return expenseRecordReturn;
  }

  async updateExpenseRecord({ auth, request, response }) {
    // id is the company id this driver belongs to
    //data is the values of new Driver
    const data = await request.post();
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const updateExpense = await Database.table("expenses")
      .where({ id: data.id })
      .update({
        ...data
      });
    const truckExpenses = await Expense.query()
      .with("expenseCategory", builder => {
        builder.select(["id", "label"]);
      })
      .with("expenseType", builder => {
        builder.select(["id", "label"]);
      })
      .with("vendor", builder => {
        builder.select(["id", "vendor_name"]);
      })
      .with("truck", builder => {
        builder.select(["id", "truck_reference"]);
      })
      .with("trailer", builder => {
        builder.select(["id", "trailer_reference"]);
      })
      .with("attachments")
      .where({ company_id: currentCompany.id })
      .fetch();

    return truckExpenses;
  }

  async fetchExpenseRecords({ auth, request, response }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const truckExpenses = await Expense.query()
      .with("expenseCategory", builder => {
        builder.select(["id", "label"]);
      })
      .with("expenseType", builder => {
        builder.select(["id", "label"]);
      })
      .with("vendor", builder => {
        builder.select(["id", "vendor_name"]);
      })
      .with("truck", builder => {
        builder.select(["id", "truck_reference"]);
      })
      .with("trailer", builder => {
        builder.select(["id", "trailer_reference"]);
      })
      .with("attachments")
      .where({ company_id: currentCompany.id })
      .fetch();

    return truckExpenses;
  }

  async deleteExpenseRecord({ auth, request, response, params: { id } }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();
    const data = request.get().id;

    const expenseRecord = await Expense.find(data);

    try {
      await expenseRecord.delete();

      return { success: `Successfully deleted expense` };
    } catch (err) {
      console.log(err);
      return {
        error: "Failed, please try again or contact support"
      };
    }
  }
}

module.exports = ExpenseController;
