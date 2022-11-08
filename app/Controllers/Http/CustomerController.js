"use strict";
const Database = use("Database");
const Company = use("App/Models/Company");
const Customer = use("App/Models/Customer");

class CustomerController {
  async createCustomer({ auth, request, response, params: { id, values } }) {
    try {
      const data = await request.body.values;
      const company = await request.body.id;

      const customer = await Customer.create({
        ...data,
        company_id: company
      });

      return customer;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchCustomers({ auth, request, response }) {
    try {
      const currentCompany = await Company.query()
        .where({ id: auth.user.company_id })
        .first();

      const customers = await Customer.query()
        .where({ company_id: currentCompany.id })
        .fetch();

      return customers;
    } catch (error) {}
  }

  async updateCustomer({ auth, request, response, params: { values } }) {
    const data = await request.body.values;

    const customer = await Database.table("customers")
      .where({ id: data.id })
      .update({
        ...data
      });
    const theUpdatedCustomer = await Customer.query()
      .where({ id: data.id })
      .first();

    return theUpdatedCustomer;
  }

  async deleteCustomer({ auth, request, response, params: { id } }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();
    const data = request.get().id;

    const customer = await Customer.find(data);

    try {
      let customerName = customer.customer_name || customer.customer_bill_name;
      await customer.delete();

      return { success: `Successfully deleted customer ${customerName}` };
    } catch (err) {
      console.log(err);
      return {
        error: "Failed, please try again or contact support"
      };
    }
  }
}

module.exports = CustomerController;
