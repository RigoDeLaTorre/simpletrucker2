'use strict'
const Database = use('Database')
const Company = use('App/Models/Company')
const User = use('App/Models/User')
class CompanyController {
  async createProfile({ auth, request, response }) {
    const data = await request.post()
    const profile = await Company.create({
      ...data
      // user_id: auth.user.id
    })

    const userUpdate = await Database.table('users')
      .where({ id: auth.user.id })
      .update({
        company_id: profile.id
      })

    return profile
  }

  async fetchProfile({ auth, request, response }) {
    const companyProfile = await Company.query()
      .where({ id: auth.user.company_id })
      .first()

    return companyProfile
  }

  async updateCompany({ auth, request, response, params: { values } }) {
    const data = await request.body.values

    const company = await Database.table('companies')
      .where({ id: data.id })
      .update({
        ...data
      })
    return data
  }
}

module.exports = CompanyController
