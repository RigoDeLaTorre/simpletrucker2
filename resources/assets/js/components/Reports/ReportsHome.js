import _ from 'lodash'
import moment from 'moment'
import ListItems from './ListItems'
import ReactToPrint from 'react-to-print'
import React, { Component } from 'react'
import ReportChart from './ReportChart'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchDrivers } from '../../actions/driver/fetchDrivers.js'
import { selectedLoad } from '../../actions/loads/selectedLoad.js'
import { fetchAllLoadsDetails } from '../../actions/loads/fetchAllLoadsDetails.js'

import { factoredPaidReport } from '../filterFunctions/reports/factoredPaid.js'
import {
  fetchExpenseTypes,
  fetchCategoryExpenses,
  selectExpenseRecord,
  fetchExpenseRecords
} from '../../actions/expense'

import {
  getTotalRevenue,
  getTotalFactorReservesDue,
  getTotalLoadDeductions
} from './filterFunctions'
import { getRevenue, getExpenses, sumValues } from './profitLossFunctions'
import { fetchRequest, fetchComplete } from '../../actions/fetching'
class ReportsHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedAccountType: 'datePaid',
      previousMonthTotalRevenue: 0,
      previousMonthNetIncome: 0,
      ytdExpensesTotal: 0,
      ytdExpenseData: [],
      ytdData: [],
      ytdNetIncome: 0,
      currentMonth: {
        factored: {
          rate_confirmation_amount: 0,
          load_reimbursement: 0,
          load_deduction: 0,
          other_deduction: 0,
          other_reimbursement: 0,
          factor_total_advanced: 0,
          factor_fee_amount: 0,
          factor_fee_other: 0,
          fuel_advance_amount: 0,
          fuel_advance_fee: 0,
          factor_reserve_held: 0,
          factor_reserve_amount_paid: 0,
          customer_paid_amount: 0
        },
        notfactored: {
          rate_confirmation_amount: 0,
          customer_paid_amount: 0,
          load_reimbursement: 0,
          load_deduction: 0,
          customer_quickpay_fee: 0,
          customer_paid_amount: 0
        }
      },
      previousMonth: {
        factored: {
          rate_confirmation_amount: 0,
          load_reimbursement: 0,
          load_deduction: 0,
          other_deduction: 0,
          other_reimbursement: 0,
          factor_total_advanced: 0,
          factor_fee_amount: 0,
          factor_fee_other: 0,
          fuel_advance_amount: 0,
          fuel_advance_fee: 0,
          factor_reserve_held: 0,
          factor_reserve_amount_paid: 0,
          customer_paid_amount: 0
        },
        notfactored: {
          rate_confirmation_amount: 0,
          customer_paid_amount: 0,
          load_reimbursement: 0,
          load_deduction: 0,
          customer_quickpay_fee: 0,
          customer_paid_amount: 0
        }
      },
      currentMonthExpenses: {},
      dataCurrentMonth: []
    }
  }
  componentDidMount() {
    this.props.fetchRequest('Dashboard')
    this.setState({
      year: moment().year()
    })

    this.props.fetchExpenseRecords()
    this.props.fetchCategoryExpenses()
    this.props.fetchAllLoadsDetails(() => {
      setTimeout(() => {
        this.props.fetchComplete()
      }, 0)

      this.runAll()
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      _.isEqual(
        prevProps.expenses.expenseRecords,
        this.props.expenses.expenseRecords
      ) == false ||
      _.isEqual(prevProps.loads.loads, this.props.loads.loads) == false
    ) {
      this.props.fetchRequest('Dashboard')
      this.runAll()
      setTimeout(() => {
        this.props.fetchComplete()
      }, 0)
    }
  }

  getTotalFees = (whichmonth, logic = 'showstate', loads = null) => {
    let totalFees
    if (logic == 'currentLogic') {
      totalFees = (
        parseFloat(
          loads.factored.factor_fee_amount +
            loads.factored.factor_fee_other +
            loads.factored.fuel_advance_fee +
            loads.factored.other_deduction +
            loads.factored.load_deduction
        ) +
        parseFloat(
          loads.notfactored.customer_quickpay_fee +
            loads.notfactored.load_deduction
        )
      ).toFixed(2)
    } else {
      totalFees = (
        parseFloat(
          this.state[whichmonth].factored.factor_fee_amount +
            this.state[whichmonth].factored.factor_fee_other +
            this.state[whichmonth].factored.fuel_advance_fee +
            this.state[whichmonth].factored.other_deduction +
            this.state[whichmonth].factored.load_deduction
        ) +
        parseFloat(
          this.state[whichmonth].notfactored.customer_quickpay_fee +
            this.state[whichmonth].notfactored.load_deduction
        )
      ).toFixed(2)
    }
    return totalFees
  }

  getExpenses = whichmonth => {
    if (
      this.props.currentstate.expenses == null ||
      Object.keys(this.state[whichmonth]).length === 0
    ) {
      return ''
    } else {
      return _.map(this.state[whichmonth], (val, key) => {
        return { y: val, label: key }
      })
    }
  }

  getTotalRevenue = (whichmonth, logic = 'showstate', loads = null) => {
    let totalRevenue
    if (logic == 'currentLogic') {
      totalRevenue = (
        parseFloat(
          loads.factored.factor_total_advanced +
            loads.factored.factor_fee_amount +
            loads.factored.factor_fee_other +
            loads.factored.fuel_advance_amount +
            loads.factored.fuel_advance_fee +
            loads.factored.other_deduction +
            loads.factored.load_deduction +
            loads.factored.factor_reserve_amount_paid
        ) +
        parseFloat(
          loads.notfactored.customer_paid_amount +
            loads.notfactored.customer_quickpay_fee +
            loads.notfactored.load_deduction
        )
      ).toFixed(2)
    } else {
      totalRevenue = (
        parseFloat(
          this.state[whichmonth].factored.factor_total_advanced +
            this.state[whichmonth].factored.factor_fee_amount +
            this.state[whichmonth].factored.factor_fee_other +
            this.state[whichmonth].factored.fuel_advance_amount +
            this.state[whichmonth].factored.fuel_advance_fee +
            this.state[whichmonth].factored.other_deduction +
            this.state[whichmonth].factored.load_deduction +
            this.state[whichmonth].factored.factor_reserve_amount_paid
        ) +
        parseFloat(
          this.state[whichmonth].notfactored.customer_paid_amount +
            this.state[whichmonth].notfactored.customer_quickpay_fee +
            this.state[whichmonth].notfactored.load_deduction
        )
      ).toFixed(2)
    }

    return totalRevenue
  }

  runAll = () => {
    // current month

    let datePreviousMonth = moment().month()
    let dateCurrentMonth = datePreviousMonth + 1
    let dateYear = moment().year()

    const currentMonth = getRevenue(
      this.props.loads.loads,
      dateCurrentMonth,
      dateYear,
      this.state.selectedAccountType
    )
    const previousMonth = getRevenue(
      this.props.loads.loads,
      datePreviousMonth,
      dateYear,
      this.state.selectedAccountType
    )

    const currentMonthExpenses = getExpenses(
      this.props.expenses.expenseRecords,
      dateCurrentMonth,
      dateYear,
      this.state.selectedAccountType
    )
    const previousMonthExpenses = getExpenses(
      this.props.expenses.expenseRecords,
      datePreviousMonth,
      dateYear,
      this.state.selectedAccountType
    )

    // ************* logic for Chart Data ******************

    //******Previous Month **********

    let previousMonthFees = this.getTotalFees(
      'previousMonth',
      'currentLogic',
      previousMonth
    )
    let previousMonthTotalRevenue = this.getTotalRevenue(
      'previousMonth',
      'currentLogic',
      previousMonth
    )

    let previousMonthTotalExpenses =
      Object.keys(previousMonthExpenses).length == 0
        ? parseFloat(previousMonthFees).toFixed(2)
        : (
            parseFloat(sumValues(previousMonthExpenses)) +
            parseFloat(previousMonthFees)
          ).toFixed(2)

    let totalAmountPreviousMonth =
      parseFloat(previousMonthTotalExpenses) +
      parseFloat(previousMonthTotalRevenue)
    let previousMonthNetIncome =
      previousMonthTotalRevenue - previousMonthTotalExpenses

    //****End Previous Month *****

    let currentMonthFees = this.getTotalFees(
      'currentMonth',
      'currentLogic',
      currentMonth
    )

    let currentMonthTotalRevenue = this.getTotalRevenue(
      'currentMonth',
      'currentLogic',
      currentMonth
    )

    let currentMonthTotalExpenses =
      Object.keys(currentMonthExpenses).length == 0
        ? parseFloat(currentMonthFees).toFixed(2)
        : (
            parseFloat(sumValues(currentMonthExpenses)) +
            parseFloat(currentMonthFees)
          ).toFixed(2)

    let totalAmountCurrentMonth =
      parseFloat(currentMonthTotalExpenses) +
      parseFloat(currentMonthTotalRevenue)

    let currentMonthNetIncome = parseFloat(
      currentMonthTotalRevenue - currentMonthTotalExpenses
    ).toFixed(2)

    let data1 = _.map(currentMonthExpenses, (val, key) => {
      let y =
        (parseFloat(val) / parseFloat(totalAmountCurrentMonth)).toFixed(2) * 100
      return {
        y,
        label: `${key} : ${val}`
      }
    })

    //***************** Current DAta Graph *************

    let dataCurrentMonthY =
      (
        parseFloat(currentMonthFees) / parseFloat(totalAmountCurrentMonth)
      ).toFixed(2) * 100

    let dataCurrentMonthTotalRevenueY =
      (
        parseFloat(currentMonthTotalRevenue) /
        parseFloat(totalAmountCurrentMonth)
      ).toFixed(2) * 100

    let dataCurrentMonth = [
      ...data1,
      {
        y: isNaN(dataCurrentMonthY) ? 0 : dataCurrentMonthY,
        label: `Fees $${currentMonthFees}`
      },

      {
        y: isNaN(dataCurrentMonthTotalRevenueY)
          ? 0
          : dataCurrentMonthTotalRevenueY,
        label: `Revenue $${currentMonthTotalRevenue}`
      }
    ]

    // **********YTD Expenses ****************
    let ytdExpenses = getExpenses(
      this.props.expenses.expenseRecords,
      'all-year',
      dateYear,
      this.state.selectedAccountType
    )

    let ytdExpensesTotal = sumValues(ytdExpenses)

    let ytdExpenseData = _.map(ytdExpenses, (val, key) => {
      let y = (parseFloat(val) / parseFloat(ytdExpensesTotal)).toFixed(2) * 100
      return {
        y,
        label: `${key} : ${val}`
      }
    })

    //**********YTD Net Income  **********

    //revenue object data
    let ytdRevenue = getRevenue(
      this.props.loads.loads,
      'all-year',
      dateYear,
      this.state.selectedAccountType
    )
    //total factor fees
    let ytdRevenueMonthFees = this.getTotalFees(
      'currentMonth',
      'currentLogic',
      ytdRevenue
    )
    // total revenue number
    let ytdRevenueTotal = this.getTotalRevenue(
      'previousMonth',
      'currentLogic',
      ytdRevenue
    )

    let ytdNetIncome = parseFloat(
      ytdRevenueTotal - ytdExpensesTotal - ytdRevenueMonthFees
    ).toFixed(2)

    let totalAmountYtd =
      parseFloat(ytdExpensesTotal) +
      parseFloat(ytdRevenueTotal) +
      parseFloat(ytdRevenueMonthFees)

    //************* YTD DATA GRAPH

    let ytdDataRevY =
      (parseFloat(ytdRevenueTotal) / parseFloat(totalAmountYtd)).toFixed(2) *
      100
    let ytdDataExpenseY =
      (parseFloat(ytdExpensesTotal) / parseFloat(totalAmountYtd)).toFixed(2) *
      100
    let ytdDataFeesY =
      (parseFloat(ytdRevenueMonthFees) / parseFloat(totalAmountYtd)).toFixed(
        2
      ) * 100

    let ytdData = [
      {
        y: isNaN(ytdDataRevY) ? 0 : ytdDataRevY,
        label: `Revenue:${ytdRevenueTotal}`
      },
      {
        y: isNaN(ytdDataExpenseY) ? 0 : ytdDataExpenseY,
        label: `Expenses:${ytdExpensesTotal}`
      },
      {
        y: isNaN(ytdDataFeesY) ? 0 : ytdDataFeesY,
        label: `Fees/Deductions:${ytdRevenueMonthFees}`
      }
    ]

    this.setState({
      currentMonth,
      previousMonth,
      currentMonthExpenses,
      dataCurrentMonth,
      currentMonthNetIncome,
      previousMonthTotalRevenue,
      previousMonthNetIncome,
      ytdExpenseData,
      ytdExpensesTotal,
      ytdNetIncome,
      ytdData
    })
  }

  render() {
    return (
      <section className="app-container reports-home">
        <div className="reports-home__section">
          <h1 className="reports-home__title">Report Summary</h1>
          <h2 className="reports-home__subTitle">Revenue</h2>
          <div className="reports-home__groupContainer">
            <div className="reports-home__group">
              <h4 className="reports-home__h2">
                {' '}
                {moment().format('MMMM')} {moment().format('YYYY')}
              </h4>
              <h4 className="reports-home__month">Current Month</h4>
              <h3 className="reports-home__totalAmount reports-home__totalAmount--current">
                ${this.getTotalRevenue('currentMonth')}
              </h3>
            </div>
            <div className="reports-home__group">
              <h4 className="reports-home__h2">
                {moment()
                  .subtract(1, 'months')
                  .format('MMMM')}{' '}
                2019
              </h4>
              <h4 className="reports-home__month">Last Month</h4>
              <h3 className="reports-home__totalAmount">
                ${this.getTotalRevenue('previousMonth')}
              </h3>
            </div>
          </div>
          <h2 className="reports-home__subTitle">Net Income</h2>
          <div className="reports-home__groupContainer">
            <div className="reports-home__group">
              <h4 className="reports-home__h2">
                {moment().format('MMMM')} {moment().format('YYYY')}
              </h4>
              <h4 className="reports-home__month">Current Month</h4>
              <h3 className="reports-home__totalAmount reports-home__totalAmount--current">
                ${' '}
                {this.state.currentMonthNetIncome
                  ? this.state.currentMonthNetIncome
                  : 0}
              </h3>
            </div>
            <div className="reports-home__group">
              <h4 className="reports-home__h2">
                {moment()
                  .subtract(1, 'months')
                  .format('MMMM')}{' '}
                2019
              </h4>
              <h4 className="reports-home__month">Last Month</h4>
              <h3 className="reports-home__totalAmount">
                $ {this.state.previousMonthNetIncome}
              </h3>
            </div>
          </div>
          <div id="chart1">
            <span>.</span>
            <span>.</span>{' '}
            <ReportChart
              title={moment().format('MMMM') + ' ' + moment().format('YYYY')}
              data={this.state.dataCurrentMonth}
              type="pie"
            />
          </div>
        </div>
        <div className="reports-home__section">
          <div id="chart2">
            <span>.</span>
            <span>.</span>

            <ReportChart
              title={`Net Income YTD: $${this.state.ytdNetIncome}`}
              data={this.state.ytdData}
              type="column"
            />
          </div>
          <div id="chart3">
            <span>.</span>
            <span>.</span>

            <ReportChart
              title={`Expenses YTD: $${this.state.ytdExpensesTotal}`}
              data={this.state.ytdExpenseData}
              type="doughnut"
            />
          </div>
        </div>
      </section>
    )
  }
}

function mapStatetoProps(state) {
  return {
    drivers: state.drivers.drivers,
    loads: state.loads,
    company: state.company,
    customers: state.customers.customers,
    expenses: state.expense
  }
}
export default connect(
  mapStatetoProps,
  {
    fetchDrivers,
    selectedLoad,
    fetchAllLoadsDetails,
    fetchExpenseRecords,
    fetchCategoryExpenses,
    fetchRequest,
    fetchComplete
  }
)(ReportsHome)
