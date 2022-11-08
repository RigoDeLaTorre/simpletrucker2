"use strict";

const Schema = use("Schema");
const UserRole = use("App/Models/UserRole");

class UserRoleSeederSchema extends Schema {
  up() {
    async function gonow() {
      await UserRole.create({
        role_name: "superuser"
      });
      await UserRole.create({
        role_name: "admin"
      });
      await UserRole.create({
        role_name: "user"
      });
      await UserRole.create({
        role_name: "subuser"
      });
      await UserRole.create({
        role_name: "driver"
      });
    }
    gonow();
  }

  down() {
    this.table("user_role_seeders", table => {
      // reverse alternations
    });
  }
}

module.exports = UserRoleSeederSchema;
