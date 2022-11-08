"use strict";
const Company = use("App/Models/Company");

class CheckUserCredit {
  async handle({ auth, request, response, view }, next) {
    // const company = await Company.find(auth.user.company_id);
    //
    // if (company.credits < 10) {
    //   console.log("no credits");
    //
    //   return response.redirect("/home/addcredits");
    // }
    // console.log("nexttttt");
    // await next();
  }
}

module.exports = CheckUserCredit;
