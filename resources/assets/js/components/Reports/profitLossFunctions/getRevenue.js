import moment from "moment";
// loads, month, year, accountType

let sliceYear = date => {
  if (date == null) {
    return null;
  } else {
    return date.slice(date.length - 4);
  }
};

let sliceMonth = date => {
  if (date == "all-year") {
    return "all-year";
  } else if (date == null) {
    return null;
  } else {
    return parseInt(date.split("/")[0]);
  }
};

// loads , january, 2019, datePaid or dateDelivered, factored
const getRevenue = (loads, period, year, accountType) => {
  // period = period == 'all-year' ? 'all-year' : parseInt(period)
  period =
    period == "all-year"
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      : period == "first-quarter"
      ? [1, 2, 3]
      : period == "second-quarter"
      ? [4, 5, 6]
      : period == "third-quarter"
      ? [7, 8, 9]
      : period == "fourth-quarter"
      ? [10, 11, 12]
      : [parseInt(period)];

  // if datePaid
  // return obj of rate_confirmation_amount, load_deduction, and load_reimbursement

  // period coming in will be 01,02,03 etc
  //check if 01 matches to load customer paid date

  if (accountType == "datePaid") {
    return loads.reduce(
      (total, load) => {
        let d1 = load.customer_paid_date || load.factor_paid_date;
        let paidDate = d1 ? d1.slice(d1.length - 4) : 0;

        let customerPaidDatePeriod = sliceMonth(load.customer_paid_date); //01
        let customerPaidDateYear = sliceYear(load.customer_paid_date);

        let fuelAdvanceDatePeriod = sliceMonth(load.fuel_advance_date);
        let fuelAdvanceDateYear = sliceYear(load.fuel_advance_date);

        let factorDatePaidPeriod = sliceMonth(load.factor_paid_date);
        let factorDatePaidYear = sliceYear(load.factor_paid_date);

        let factorReservesDatePaidYear = sliceYear(
          load.factor_reserve_amount_paid_date
        );
        let factorReservesDatePaidPeriod = sliceMonth(
          load.factor_reserve_amount_paid_date
        );

        // Customer Paid Year
        let customerPaidDateYearMatches =
          customerPaidDateYear == year ? true : false;
        let customerPaidDatePeriodMatches =
          customerPaidDatePeriod && period.includes(customerPaidDatePeriod)
            ? true
            : customerPaidDatePeriod && period.includes(customerPaidDatePeriod)
            ? true
            : false;

        // Factor Date year
        let factorDatePaidYearMatches =
          factorDatePaidYear && factorDatePaidYear == year ? true : false;
        let factorDatePaidPeriodMatches =
          factorDatePaidPeriod && period.includes(factorDatePaidPeriod)
            ? true
            : factorDatePaidPeriod && period.includes(factorDatePaidPeriod)
            ? true
            : false;

        // Fuel Advance Year
        let fuelAdvanceDateYearMatches =
          fuelAdvanceDateYear && fuelAdvanceDateYear == year ? true : false;
        let fuelAdvanceDatePeriodMatches =
          fuelAdvanceDatePeriod && period.includes(fuelAdvanceDatePeriod)
            ? true
            : fuelAdvanceDatePeriod && period.includes(fuelAdvanceDatePeriod)
            ? true
            : false;

        // Factor Reserve Year
        let factorReservesDatePaidYearMatches =
          factorReservesDatePaidYear && factorReservesDatePaidYear == year
            ? true
            : false;

        let factorReservesDatePaidPeriodMatches =
          factorReservesDatePaidPeriod &&
          period.includes(factorReservesDatePaidPeriod)
            ? true
            : factorReservesDatePaidPeriod &&
              period.includes(factorReservesDatePaidPeriod)
            ? true
            : false;

        // customer paid
        if (
          (load.load_status == "delivered" &&
            load.load_processed == 1 &&
            customerPaidDateYear) ||
          (load.load_status == "delivered" &&
            load.load_processed == 1 &&
            fuelAdvanceDateYear) ||
          (load.load_status == "delivered" &&
            load.load_processed == 1 &&
            factorDatePaidYear)
        ) {
          let currentStatus = load.load_processed_type;

          if (currentStatus != "factor") {
            total.notfactored = {
              rate_confirmation_amount:
                customerPaidDateYearMatches && customerPaidDatePeriodMatches
                  ? total.notfactored.rate_confirmation_amount +
                    load.rate_confirmation_amount
                  : total.notfactored.rate_confirmation_amount,
              customer_paid_amount:
                customerPaidDateYearMatches && customerPaidDatePeriodMatches
                  ? total.notfactored.customer_paid_amount +
                    load.customer_paid_amount
                  : total.notfactored.customer_paid_amount,
              load_reimbursement:
                customerPaidDateYearMatches && customerPaidDatePeriodMatches
                  ? total.notfactored.load_reimbursement +
                    load.load_reimbursement
                  : total.notfactored.load_reimbursement,
              load_deduction:
                customerPaidDateYearMatches && customerPaidDatePeriodMatches
                  ? total.notfactored.load_deduction + load.load_deduction
                  : total.notfactored.load_deduction,

              customer_quickpay_fee:
                customerPaidDateYearMatches && customerPaidDatePeriodMatches
                  ? total.notfactored.customer_quickpay_fee +
                    load.customer_quickpay_fee
                  : total.notfactored.customer_quickpay_fee,
              customer_paid_amount:
                customerPaidDateYearMatches && customerPaidDatePeriodMatches
                  ? total.notfactored.customer_paid_amount +
                    load.customer_paid_amount
                  : total.notfactored.customer_paid_amount
            };
          } else {
            total.factored = {
              rate_confirmation_amount:
                factorDatePaidYearMatches && factorDatePaidPeriodMatches
                  ? total.factored.rate_confirmation_amount +
                    load.rate_confirmation_amount
                  : total.factored.rate_confirmation_amount,
              load_reimbursement:
                factorDatePaidYearMatches && factorDatePaidPeriodMatches
                  ? total.factored.load_reimbursement + load.load_reimbursement
                  : total.factored.load_reimbursement,
              load_deduction:
                factorDatePaidYearMatches && factorDatePaidPeriodMatches
                  ? total.factored.load_deduction + load.load_deduction
                  : total.factored.load_deduction,
              other_deduction:
                factorDatePaidYearMatches &&
                factorDatePaidPeriodMatches &&
                factorReservesDatePaidYearMatches &&
                factorReservesDatePaidPeriodMatches
                  ? total.factored.other_deduction + load.other_deduction
                  : total.factored.other_deduction,
              other_reimbursement:
                factorDatePaidYearMatches &&
                factorDatePaidPeriodMatches &&
                factorReservesDatePaidYearMatches &&
                factorReservesDatePaidPeriodMatches
                  ? total.factored.other_reimbursement +
                    load.other_reimbursement
                  : total.factored.other_reimbursement,
              factor_total_advanced:
                factorDatePaidYearMatches && factorDatePaidPeriodMatches
                  ? total.factored.factor_total_advanced +
                    load.factor_total_advanced
                  : total.factored.factor_total_advanced,
              factor_fee_amount:
                factorDatePaidYearMatches && factorDatePaidPeriodMatches
                  ? total.factored.factor_fee_amount + load.factor_fee_amount
                  : total.factored.factor_fee_amount,
              factor_fee_other:
                customerPaidDateYearMatches && customerPaidDatePeriodMatches
                  ? total.factored.factor_fee_other + load.factor_fee_other
                  : total.factored.factor_fee_other,
              fuel_advance_amount:
                fuelAdvanceDateYearMatches && fuelAdvanceDatePeriodMatches
                  ? total.factored.fuel_advance_amount +
                    load.fuel_advance_amount
                  : total.factored.fuel_advance_amount,
              fuel_advance_fee:
                fuelAdvanceDateYearMatches && fuelAdvanceDatePeriodMatches
                  ? total.factored.fuel_advance_fee + load.fuel_advance_fee
                  : total.factored.fuel_advance_fee,
              factor_reserve_held:
                factorDatePaidYearMatches &&
                factorDatePaidPeriodMatches &&
                factorReservesDatePaidYear
                  ? total.factored.factor_reserve_held
                  : factorDatePaidYearMatches && factorDatePaidPeriodMatches
                  ? total.factored.factor_reserve_held +
                    load.factor_reserve_held
                  : total.factored.factor_reserve_held,

              factor_reserve_amount_paid:
                factorReservesDatePaidYearMatches &&
                factorReservesDatePaidPeriodMatches
                  ? total.factored.factor_reserve_amount_paid +
                    load.factor_reserve_amount_paid
                  : total.factored.factor_reserve_amount_paid,
              customer_paid_amount:
                customerPaidDateYearMatches && customerPaidDatePeriodMatches
                  ? total.factored.customer_paid_amount +
                    load.customer_paid_amount
                  : total.factored.customer_paid_amount
            };
          }
        }
        return total;
      },
      {
        factored: {
          rate_confirmation_amount: 0,
          load_reimbursement: 0,
          load_deduction: 0,
          factor_total_advanced: 0,
          factor_fee_amount: 0,
          factor_fee_other: 0,
          fuel_advance_amount: 0,
          fuel_advance_fee: 0,
          factor_reserve_amount_paid: 0,
          factor_reserve_held: 0,
          customer_paid_amount: 0,
          other_deduction: 0,
          other_reimbursement: 0
        },
        notfactored: {
          rate_confirmation_amount: 0,
          load_reimbursement: 0,
          load_deduction: 0,
          customer_quickpay_fee: 0,
          customer_paid_amount: 0
        }
      }
    );
  } else if (accountType == "dateDelivered") {
    return loads.reduce(
      (total, load) => {
        let d1 = load["deliveries"].length
          ? load["deliveries"].slice(-1)[0].delivery_date
          : null;
        let deliverYear = d1 ? d1.slice(d1.length - 4) : 0;
        // customer paid
        if (
          load.load_status == "delivered" &&
          load.load_processed == 1 &&
          deliverYear == year
        ) {
          let currentStatus = load.load_processed_type;

          if (currentStatus != "factor") {
            total.notfactored = {
              rate_confirmation_amount:
                total.notfactored.rate_confirmation_amount +
                load.rate_confirmation_amount,
              customer_paid_amount:
                total.notfactored.customer_paid_amount +
                load.customer_paid_amount,
              load_reimbursement:
                total.notfactored.load_reimbursement + load.load_reimbursement,
              load_deduction:
                total.notfactored.load_deduction + load.load_deduction,
              customer_quickpay_fee:
                total.notfactored.customer_quickpay_fee +
                load.customer_quickpay_fee,
              customer_paid_amount:
                total.notfactored.customer_paid_amount +
                load.customer_paid_amount
            };
          } else {
            total.factored = {
              rate_confirmation_amount:
                total.factored.rate_confirmation_amount +
                load.rate_confirmation_amount,
              load_reimbursement:
                total.factored.load_reimbursement + load.load_reimbursement,
              load_deduction:
                total.factored.load_deduction + load.load_deduction,
              factor_total_advanced:
                total.factored.factor_total_advanced +
                load.factor_total_advanced,
              factor_fee_amount:
                total.factored.factor_fee_amount + load.factor_fee_amount,
              factor_fee_other:
                total.factored.factor_fee_other + load.factor_fee_other,
              fuel_advance_amount:
                total.factored.fuel_advance_amount + load.fuel_advance_amount,
              fuel_advance_fee:
                total.factored.fuel_advance_fee + load.fuel_advance_fee,
              factor_reserve_amount_paid:
                total.factored.factor_reserve_amount_paid +
                load.factor_reserve_amount_paid,
              customer_paid_amount:
                total.factored.customer_paid_amount + load.customer_paid_amount
            };
          }
        }
        return total;
      },
      {
        factored: {
          rate_confirmation_amount: 0,
          load_reimbursement: 0,
          load_deduction: 0,
          factor_total_advanced: 0,
          factor_fee_amount: 0,
          factor_fee_other: 0,
          fuel_advance_amount: 0,
          fuel_advance_fee: 0,
          factor_reserve_amount_paid: 0,
          customer_paid_amount: 0
        },
        notfactored: {
          rate_confirmation_amount: 0,
          load_reimbursement: 0,
          load_deduction: 0,
          customer_quickpay_fee: 0,
          customer_paid_amount: 0
        }
      }
    );
  }
};

export { getRevenue };
