'use strict'

const Schema = use('Schema')

class AlterCheckoutsSchema extends Schema {
  up() {
    this.table('alter_checkouts', table => {
      this.raw('ALTER TABLE checkouts AUTO_INCREMENT = 5000')
    })
  }
  down() {
    this.table('alter_checkouts', table => {
      this.raw('ALTER TABLE checkouts AUTO_INCREMENT = 1')
    })
  }
}

module.exports = AlterCheckoutsSchema
