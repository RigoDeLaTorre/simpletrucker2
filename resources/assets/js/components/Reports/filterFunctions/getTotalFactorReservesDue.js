import moment from 'moment'

const getTotalFactorReservesDue = (loads, type) => {
  let currentYear = moment().year()
  let currentMonth = moment().month() + 1
  let previousMonth = moment().month()

  if (type == 'ytd') {
    return loads.reduce((total, load) => {
      let d1 = load.factor_paid_date || load.customer_paid_date
      let currentDate = d1 ? d1.slice(d1.length - 4) : 0
      let amount = load.factor_reserve_held

      if (
        (load.load_processed_type =
          'factor' &&
          load.load_status == 'delivered' &&
          load.load_processed &&
          load.factor_reserve_held != 0 &&
          load.factor_reserve_amount_paid_date == null &&
          currentDate == currentYear)
      ) {
        return total + amount
      } else {
        return total
      }
    }, 0)
  } else if (type == 'lastMonth') {
    return loads.reduce((total, load) => {
      let d1 = load.factor_paid_date || load.customer_paid_date
      let currentDate = d1 ? parseInt(d1.split('/')[0]) : 0
      let amount = load.factor_reserve_held || 0

      if (
        (load.load_processed_type =
          'factor' &&
          load.load_status == 'delivered' &&
          load.load_processed &&
          load.factor_reserve_held != 0 &&
          load.factor_reserve_amount_paid_date == null &&
          currentDate == previousMonth)
      ) {
        return total + amount
      } else {
        return total
      }
    }, 0)
  } else if (type == 'currentMonth') {
    return loads.reduce((total, load) => {
      let d1 = load.factor_paid_date || load.customer_paid_date
      let currentDate = d1 ? parseInt(d1.split('/')[0]) : 0
      let amount = load.factor_reserve_held || 0

      if (
        (load.load_processed_type =
          'factor' &&
          load.load_status == 'delivered' &&
          load.load_processed == 1 &&
          load.factor_reserve_held != 0 &&
          load.factor_reserve_amount_paid_date == null &&
          currentDate == currentMonth)
      ) {
        return total + amount
      } else {
        return total
      }
    }, 0)
  }
}

export { getTotalFactorReservesDue }
