import moment from 'moment'

const getTotalRevenue = (loads, type) => {
  let currentYear = moment().year()
  let currentMonth = moment().month() + 1
  let previousMonth = moment().month()

  if (type == 'ytd') {
    return loads.reduce((total, load) => {
      let d1 = load.factor_paid_date || load.customer_paid_date
      let currentDate = d1 ? d1.slice(d1.length - 4) : 0
      let amountpaid =
        load.rate_confirmation_amount -
        load.load_deduction +
        load.load_reimbursement

      if (
        (load.load_status == 'delivered' &&
          load.load_processed == 1 &&
          load.customer_paid_date &&
          currentDate == currentYear) ||
        (load.load_status == 'delivered' &&
          load.load_processed == 1 &&
          load.factor_total_advanced &&
          currentDate == currentYear)
      ) {
        return total + parseFloat(amountpaid)
      } else {
        return total
      }
    }, 0)
  } else if (type == 'lastMonth') {
    return loads.reduce((total, load) => {
      let d1 = load.factor_paid_date || load.customer_paid_date
      let currentDate = d1 ? parseInt(d1.split('/')[0]) : 0
      let amountpaid =
        load.rate_confirmation_amount -
        load.load_deduction +
        load.load_reimbursement

      if (
        (load.load_status == 'delivered' &&
          load.load_processed == 1 &&
          load.customer_paid_date &&
          currentDate == previousMonth) ||
        (load.load_status == 'delivered' &&
          load.load_processed == 1 &&
          load.factor_total_advanced &&
          currentDate == previousMonth)
      ) {
        return total + parseFloat(amountpaid)
      } else {
        return total
      }
    }, 0)
  } else if (type == 'currentMonth') {
    return loads.reduce((total, load) => {
      let d1 = load.factor_paid_date || load.customer_paid_date
      let currentDate = d1 ? parseInt(d1.split('/')[0]) : 0
      let amountpaid =
        load.rate_confirmation_amount -
        load.load_deduction +
        load.load_reimbursement
      if (
        (load.load_status == 'delivered' &&
          load.load_processed == 1 &&
          load.customer_paid_date &&
          currentDate == currentMonth) ||
        (load.load_status == 'delivered' &&
          load.load_processed == 1 &&
          load.factor_total_advanced &&
          currentDate == currentMonth)
      ) {
        return total + parseFloat(amountpaid)
      } else {
        return total
      }
    }, 0)
  }
}

export { getTotalRevenue }
