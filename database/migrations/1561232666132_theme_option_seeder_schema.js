"use strict";

const Schema = use("Schema");
const ThemeOption = use("App/Models/ThemeOption");

class ThemeOptionSeederSchema extends Schema {
  up() {
    async function gonow() {
      await ThemeOption.create({
        label: "themeDark"
      });
      await ThemeOption.create({
        label: "themeLight"
      });
      await ThemeOption.create({
        label: "themeLightTopDark"
      });
    }
    gonow();
  }

  down() {
    this.table("theme_option_seeders", table => {
      // reverse alternations
    });
  }
}

module.exports = ThemeOptionSeederSchema;
