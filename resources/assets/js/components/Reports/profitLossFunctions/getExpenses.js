import moment from 'moment'
// loads, month, year, accountType

let sliceYear = date => {
  if (date == null) {
    return null
  } else {
    return date.slice(date.length - 4)
  }
}

let sliceMonth = date => {
  if (date == 'all-year') {
    return 'all-year'
  } else if (date == null) {
    return null
  } else {
    return parseInt(date.split('/')[0])
  }
}

//expenses : array of objects
//period : all year, first quarter, jan, march etc
// year : 2019, 2018 etc
//accountType: date paid, date accrued etc
const getExpenses = (expenses, period, year, accountType) => {
  // period = period == 'all-year' ? 'all-year' : parseInt(period)
  period =
    period == 'all-year'
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      : period == 'first-quarter'
        ? [1, 2, 3]
        : period == 'second-quarter'
          ? [4, 5, 6]
          : period == 'third-quarter'
            ? [7, 8, 9]
            : period == 'fourth-quarter'
              ? [10, 11, 12]
              : [parseInt(period)]

  let allCategorizedExpenses = expenses.reduce((acc, curr) => {
    let currentCategory = curr.expenseCategory.label
    let currYear = sliceYear(curr.date)
    let currMonth = sliceMonth(curr.date)

    let yearMatches = currYear == year ? true : false
    let currMonthMatches = period.includes(currMonth) ? true : false

    // yearMatches && periodMatches
    if (yearMatches && currMonthMatches) {
      let w = acc[currentCategory]
        ? parseFloat(acc[currentCategory]) + parseFloat(curr.amount)
        : curr.amount
      acc = {
        ...acc,
        ...{
          [curr.expenseCategory.label]: parseFloat(w).toFixed(2)
        }
      }
      return acc
    } else {
      return acc
    }
  }, {})

  return allCategorizedExpenses
}

export { getExpenses }
