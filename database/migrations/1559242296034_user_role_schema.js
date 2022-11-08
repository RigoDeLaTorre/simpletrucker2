'use strict'

const Schema = use('Schema')

class UserRoleSchema extends Schema {
  up () {
    this.create('user_roles', (table) => {
      table.increments()
      table.string('role_name', 30).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('user_roles')
  }
}

module.exports = UserRoleSchema
