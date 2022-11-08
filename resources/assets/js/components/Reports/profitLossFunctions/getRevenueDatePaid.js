// import moment from 'moment'
// // loads, month, year, accountType
//
// // loads , january, 2019, datePaid or dateDelivered
// const getRevenue = (loads, period, year, accountType) => {
//   let sliceYear = date => {
//     if (date == null) {
//       return null
//     } else {
//       return date.slice(date.length - 4)
//     }
//   }
//   // if datePaid
//   // return obj of rate_confirmation_amount, load_deduction, and load_reimbursement
//   if (type == 'datePaid') {
//     return loads.reduce(
//       (total, load) => {
//         //factor , nonfactored
//         let processType = load.load_processed_type
//         let d1 = load.factor_paid_date || load.customer_paid_date
//         let paidDate = d1 ? d1.slice(d1.length - 4) : 0
//
//         let fuelAdvanceDate = sliceYear(load.fuel_advance_date)
//         let customerPaidDate = sliceYear(load.customer_paid_date)
//
//         let rate_confirmation_amount =
//           customerPaidDate && customerPaidDate == year
//             ? load.rate_confirmation_amount + total.rate_confirmation_amount
//             : total.rate_confirmation_amount
//         let fuel_advance_amount =
//           fuelAdvanceDate && fuelAdvanceDate == year
//             ? load.fuel_advance_amount + total.fuel_advance_amount
//             : total.fuel_advance_amount
//
//         let customer_paid_amount =
//           customerPaidDate && customerPaidDate == year
//             ? load.customer_paid_amount + total.customer_paid_amount
//             : total.customer_paid_amount
//         let customer_quickpay_fee =
//           customerPaidDate && customerPaidDate == year
//             ? load.customer_quickpay_fee + total.customer_quickpay_fee
//             : total.customer_quickpay_fee
//
//         let load_reimbursement =
//           load.customer_paid_date == year
//             ? load.rate_confirmation_amount + total.rate_confirmation_amount
//             : total.rate_confirmation_amount
//         let rate_confirmation_amount =
//           load.customer_paid_date == year
//             ? load.rate_confirmation_amount + total.rate_confirmation_amount
//             : total.rate_confirmation_amount
//         let rate_confirmation_amount =
//           load.customer_paid_date == year
//             ? load.rate_confirmation_amount + total.rate_confirmation_amount
//             : total.rate_confirmation_amount
//
//         // customer paid
//         if (
//           load.load_status == 'delivered' &&
//           load.load_processed == 1 &&
//           load.customer_paid_date &&
//           paidDate == currentYear
//         ) {
//           return {
//             rate_confirmation_amount:
//               total.rate_confirmation_pdf + load.rate_confirmation_pdf,
//             customer_paid_amount:
//               total.customer_paid_amount + load.customer_paid_amount,
//             customer_quickpay_fee:
//               total.customer_quickpay_fee + load.customer_quickpay_fee,
//             load_reimbursement:
//               total.load_reimbursement + load.load_reimbursement,
//             load_deduction: total.load_deduction + load.load_deduction,
//             factor_total_advanced: total.factor_total_advanced,
//             customer_paid_amount:
//               total.customer_paid_amount + load.customer_paid_amount,
//             fuel_advance_fee: total.fuel_advance_fee,
//             factor_reserve_amount_paid:
//               total.factor_reserve_amount_paid + load.factor_reserve_amount_paid
//           }
//         } else if (
//           load.load_status == 'delivered' &&
//           load.load_processed == 1 &&
//           !load.customer_paid_date &&
//           factor_total_advanced &&
//           paidDate == currentYear
//         ) {
//         }
//       },
//       {
//         rate_confirmation_amount: 0,
//         customer_paid_amount: 0,
//         customer_quickpay_fee: 0,
//         load_reimbursement: 0,
//         load_deduction: 0,
//         factor_total_advanced: 0,
//         fuel_advance_amount: 0,
//         fuel_advance_fee: 0,
//         factor_reserve_amount_paid: 0
//       }
//     )
//   }
// }
//
// export { getRevenueDatePaid }
