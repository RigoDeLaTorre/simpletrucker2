"use strict";

class CountryDetector {
  async handle({ request }, next) {
    request.country = 5;
    console.log("middleware fired");
    await next();
  }
}

module.exports = CountryDetector;
