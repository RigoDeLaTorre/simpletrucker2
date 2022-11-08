'use strict'

const Schema = use('Schema')

class PlanSchema extends Schema {
  up () {
    this.create('plans', (table) => {
      table.increments()
      table.string('name', 60).notNullable()
      table.string('price_per_month', 60).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('plans')
  }
}

module.exports = PlanSchema
