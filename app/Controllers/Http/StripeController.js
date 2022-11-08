'use strict'
const Database = use('Database')

//STRIPE
const STRIPE_PUBLISHABLE_KEY = Env.get('STRIPE_PUBLISHABLE_KEY')
const STRIPE_SECRET_KEY = Env.get('STRIPE_SECRET_KEY')
const stripe = require('stripe')(STRIPE_SECRET_KEY)

class StripeController {
  async stripe({ auth, request, response }) {
    const data = await request.all()

    const charge = await stripe.charges.create(
      {
        amount: 500,
        currency: 'usd',
        description: '$5 for 5 credits',
        source: data.id
      },
      async (err, charge) => {
        if (err) {
          console.log('error')
        } else {
          console.log('yahtzeee !')

          const updateCompanyCredit = await Database.table('companies')
            .where({ id: auth.user.company_id })
            .increment('credits', 1)
        }
      }
    )
  }
}

module.exports = StripeController
