'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

// Factory.blueprint('App/Models/User', (faker) => {
//   return {
//     username: faker.username()
//   }
// })

Factory.blueprint('App/Models/Customer', faker => {
  return {
    company_id: 1,
    customer_name: faker.company(),
    customer_address: faker.address(),
    customer_city: faker.city(),
    customer_state: faker.state(),
    customer_zip: faker.zip(),
    customer_phone: faker.phone(),
    customer_fax: faker.phone(),
    customer_email: faker.email(),

    customer_bill_name: faker.company(),
    customer_bill_address: faker.address(),
    customer_bill_city: faker.city(),
    customer_bill_state: faker.state(),
    customer_bill_zip: faker.zip(),
    customer_bill_phone: faker.phone(),
    customer_bill_fax: faker.phone(),
    customer_bill_email: faker.email(),
    process_type: 'notfactored'
  }
})

// Driver

Factory.blueprint('App/Models/Driver', faker => {
  return {
    company_id: 1,
    driver_first_name: faker.first(),
    driver_last_name: faker.last(),
    driver_address: faker.address(),
    driver_city: faker.city(),
    driver_state: faker.state(),
    driver_zip: faker.zip(),
    driver_phone: faker.phone(),
    driver_email: faker.email(),
    driver_pay_amount: faker.integer({ min: 30, max: 70 }),
    driver_license_number: faker.integer({ min: 500000, max: 999999 }),
    driver_license_expiration: faker.date({ string: true }),
    driver_hire_date: faker.date({ string: true })
  }
})

Factory.blueprint('App/Models/Load', (faker, i) => {
  return {
    company_id: 1,
    customer_id: faker.integer({ min: 1, max: 50 }),
    driver_id: faker.integer({ min: 1, max: 10 }),
    invoice_id: 500 + i,
    load_reference: faker.integer({ min: 4545, max: 9999999 }),
    rate_confirmation_amount: faker.integer({ min: 2000, max: 7000 })
  }
})

Factory.blueprint('App/Models/Pickup', (faker, i) => {
  return {
    load_id: i + 1,
    pickup_date: faker.date({ string: true }),
    pickup_name: faker.company(),
    pickup_address: faker.address(),
    pickup_city: faker.city(),
    pickup_state: faker.state(),
    pickup_zipcode: faker.zip()
  }
})

Factory.blueprint('App/Models/Delivery', (faker, i) => {
  return {
    load_id: i + 1,
    delivery_date: faker.date({ string: true }),
    delivery_name: faker.company(),
    delivery_address: faker.address(),
    delivery_city: faker.city(),
    delivery_state: faker.state(),
    delivery_zipcode: faker.zip()
  }
})
