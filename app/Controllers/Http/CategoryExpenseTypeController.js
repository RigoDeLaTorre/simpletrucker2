"use strict";
const CategoryExpenseType = use("App/Models/CategoryExpenseType");
const CategoryExpense = use("App/Models/CategoryExpense");
const Company = use("App/Models/Company");
const Database = use("Database");
/**
 * Resourceful controller for interacting with categoryexpensetypes
 */
class CategoryExpenseTypeController {
  async createExpenseType({ auth, request, response, params: { id, values } }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const data = await request.post().values;
    const expense = await CategoryExpenseType.create({
      ...data,
      company_id: currentCompany.id
    });
    const expenseReturn = await CategoryExpenseType.query()
      .with("category", builder => {
        builder.select(["id", "label"]);
      })
      .where({ id: expense.id })
      .first();

    return expenseReturn;
    // return { id: expense.id, category_expense_id:expense.category_expense_id, label: data.label }
  }

  async fetchExpenseTypes({ auth, request, response }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const list = await CategoryExpenseType.query()

      .where({ company_id: currentCompany.id })
      .with("category", builder => {
        builder.select(["id", "label"]);
      })
      .select(["id", "category_expense_id", "label"])
      .fetch();

    return list;
  }

  async updateExpenseType({ auth, request, response }) {
    // id is the company id this driver belongs to
    //data is the values of new Driver
    const data = await request.post();

    const updateExpense = await Database.table("category_expense_types")
      .where({ id: data.id })
      .update({
        ...data
      });

    return data;
  }

  async deleteExpenseType({ auth, request, response, params: { id } }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();
    const data = request.get().id;

    const subCategory = await CategoryExpenseType.find(data);

    try {
      let subCategoryName = subCategory.label;
      await subCategory.delete();

      return { success: `Successfully deleted ${subCategoryName}` };
    } catch (err) {
      console.log(err);
      return {
        error: "Failed, please try again or contact support"
      };
    }
  }
}

module.exports = CategoryExpenseTypeController;
