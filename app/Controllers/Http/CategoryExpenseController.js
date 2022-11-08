"use strict";
const CategoryExpense = use("App/Models/CategoryExpense");
const Company = use("App/Models/Company");
const Database = use("Database");
/**
 * Resourceful controller for interacting with categoryexpenses
 */
class CategoryExpenseController {
  async createCategoryExpense({
    auth,
    request,
    response,
    params: { id, values }
  }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const data = await request.post().values;

    const category = await CategoryExpense.create({
      ...data,
      company_id: currentCompany.id
    });

    return { id: category.id, label: data.label };
  }

  async fetchCategoryExpenses({ auth, request, response }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const categories = await CategoryExpense.query()
      .where({ company_id: currentCompany.id })
      .select(["id", "label"])
      .fetch();

    return categories;
  }

  async updateCategoryExpense({ auth, request, response }) {
    // id is the company id this driver belongs to
    //data is the values of new Driver
    const data = await request.post();

    const updateExpense = await Database.table("category_expenses")
      .where({ id: data.id })
      .update({
        ...data
      });

    return data;
  }

  async deleteCategoryExpense({ auth, request, response, params: { id } }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();
    const data = request.get().id;

    const category = await CategoryExpense.find(data);

    try {
      let categoryName = category.label;
      await category.delete();

      return { success: `Successfully deleted ${categoryName}` };
    } catch (err) {
      console.log(err);
      return {
        error: "Failed, please try again or contact support"
      };
    }
  }
}

module.exports = CategoryExpenseController;
