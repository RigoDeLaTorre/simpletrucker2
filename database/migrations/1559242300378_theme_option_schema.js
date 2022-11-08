'use strict'

const Schema = use('Schema')

class ThemeOptionSchema extends Schema {
  up () {
    this.create('theme_options', (table) => {
      table.increments()
      table.string("label",254).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('theme_options')
  }
}

module.exports = ThemeOptionSchema
