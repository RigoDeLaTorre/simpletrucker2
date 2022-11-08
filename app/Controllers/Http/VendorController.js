"use strict";
const Database = use("Database");
const Vendor = use("App/Models/Vendor");
const Company = use("App/Models/Company");

/**
 * Resourceful controller for interacting with vendors
 */
class VendorController {
  async fetchVendors({ auth, request, response }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const list = await Vendor.query()
      .where({ company_id: currentCompany.id })
      .fetch();

    return list;
  }

  async createVendor({ auth, request, response, params: { id, values } }) {
    const data = await request.post().values;
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();

    const vendor = await Vendor.create({
      ...data,
      company_id: currentCompany.id
    });

    return vendor;
  }

  async updateVendor({ auth, request, response, params: { values } }) {
    const data = await request.body.values;

    const driver = await Database.table("vendors")
      .where({ id: data.id })
      .update({
        ...data
      });

    const theUpdatedDriver = await Vendor.query()
      .where({ id: data.id })
      .first();

    return theUpdatedDriver;
  }

  async deleteVendor({ auth, request, response, params: { id } }) {
    const currentCompany = await Company.query()
      .where({ id: auth.user.company_id })
      .first();
    const data = request.get().id;

    const vendor = await Vendor.find(data);

    try {
      let vendorName = vendor.vendor_name;
      await vendor.delete();
      return { success: `Successfully deleted ${vendorName}` };
    } catch (err) {
      return {
        error: "Failed, please try again or contact support"
      };
      console.log(err);
    }
  }
}

module.exports = VendorController;
