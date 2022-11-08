import _ from 'lodash'
import moment from 'moment'
import Select from 'react-select'
import ListItems from './ListItems'
import ReactToPrint from 'react-to-print'
import ProfitLossStatement from './ProfitLossStatement'
import ProfitLossStatementSummary from './ProfitLossStatementSummary'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchRequest, fetchComplete } from '../../actions/fetching'
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

import { getRevenue, getExpenses } from './profitLossFunctions'

import {
  customStyles,
  reactSelectStylesPaginationThemeLight,
  reactSelectStylesPagination
} from '../common'

class ProfitLoss extends Component {
  constructor(props) {
    super(props)
    this.state = {
      period: 'all-year',
      year: '2019',
      selectedAccountType: 'datePaid',
      summary: true,
      dataLoads: {
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
      expenses: {}
    }
  }
  componentDidMount() {
    this.props.fetchRequest('Profit Loss')
    this.setState({
      year: moment().year()
    })

    this.props.fetchExpenseRecords()
    this.props.fetchCategoryExpenses()
    this.props.fetchAllLoadsDetails(() => {
      this.runAll()
      setTimeout(() => {
        this.props.fetchComplete()
      }, 300)
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
      this.props.fetchRequest('Profit Loss')
      setTimeout(() => {
        this.props.fetchComplete()
      }, 300)
      this.runAll()
    }
  }

  // This is the select fields, ( period, year)
  handleSearchFilter = (event, target) => {
    this.setState(
      {
        [target.name]: event.value
      },
      () => this.runAll()
    )
  }

  // 01/01..
  handleOptionChange = changeEvent => {
    this.setState(
      {
        selectedAccountType: changeEvent.target.value
      },
      () => this.runAll()
    )
  }

  runAll = () => {
    let dataLoads = getRevenue(
      this.props.loads.loads,
      this.state.period,
      this.state.year,
      this.state.selectedAccountType
    )

    let expenses = getExpenses(
      this.props.expenses.expenseRecords,
      this.state.period,
      this.state.year,
      this.state.selectedAccountType
    )

    this.setState({
      dataLoads,
      expenses
    })
  }

  render() {
    const currentYear = {
      value: moment().year(),
      label: moment().year()
    }
    const year = [
      ...new Set(
        this.props.loads.loads.map(x => moment(x.created_at).format('YYYY'))
      )
    ]

    const years = year.map(y => {
      return { value: y, label: y }
    })

    const periodOptions = [
      { value: 'all-year', label: 'All Year' },
      { value: 'first-quarter', label: 'First Quarter' },
      { value: 'second-quarter', label: 'Second Quarter' },
      { value: 'third-quarter', label: 'Third Quarter' },
      { value: 'fourth-quarter', label: 'Fourth Quarter' },
      { value: '1', label: 'January' },
      { value: '2', label: 'February' },
      { value: '3', label: 'March' },
      { value: '4', label: 'April' },
      { value: '5', label: 'May' },
      { value: '6', label: 'June' },
      { value: '7', label: 'July' },
      { value: '8', label: 'August' },
      { value: '9', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' }
    ]

    return (
      <section id="profitloss" className="app-container">
        <div>
          <ReactToPrint
            trigger={() => (
              <a href="#">
                <i className="small material-icons material-icons__printIcon">
                  print
                </i>
              </a>
            )}
            content={() => this.componentRef}
          />
          {/*
          <div style={{ display: "none" }}>

            <ProfitLossStatement
              ref={el => (this.componentRef = el)}
              currentstate={this.state}
              grossRevenue={parseInt(
                this.state.dataLoads.factored.factor_total_advanced +
                  this.state.dataLoads.factored.factor_fee_amount +
                  this.state.dataLoads.factored.factor_fee_other +
                  this.state.dataLoads.factored.fuel_advance_amount +
                  this.state.dataLoads.factored.fuel_advance_fee +
                  this.state.dataLoads.factored.factor_reserve_amount_paid
              )}
              factorFees={
                this.state.dataLoads.factored.factor_fee_amount +
                this.state.dataLoads.factored.factor_fee_other +
                this.state.dataLoads.factored.fuel_advance_fee
              }
              notfactoredRevenue={parseInt(
                this.state.dataLoads.notfactored.customer_paid_amount +
                  this.state.dataLoads.notfactored.customer_quickpay_fee
              )}
            />

          </div>
                */}
        </div>

        <div className="searchbox">
          <Select
            label="Period"
            name="period"
            className="formSelectFields col s12 form__field form__field--column form__field--minWidth300"
            type="select"
            onChange={this.handleSearchFilter}
            defaultValue={periodOptions[0]}
            placeholder="Choose Period"
            options={periodOptions}
            styles={
              this.props.settings &&
              this.props.settings.settings &&
              this.props.settings.settings.theme_option_id == 12
                ? reactSelectStylesPaginationThemeLight
                : reactSelectStylesPagination
            }
            theme={theme => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                //background
                // neutral0:"white",

                //border and divider of arrow - initial
                neutral20: '#2f3c63',

                //arrow down - after its not pristine
                neutral60: '#7f64e3',

                // no options text when user searching
                neutral40: 'orange',
                //chosen field on dropdown from previous
                primary: '#7f64e3',

                //highlight at hover
                primary25: '#e0d8fe',
                //Placeholder
                neutral50: '#8c8bcc',

                //selectd value text color
                neutral80: 'rgba(0,0,0,0.87)',
                //hover over container
                neutral30: '#7f64e3'

                // neutral5:"#dd4c4c",
                // neutral10:"#dd4c4c",
                //
                // primay50:"#dd4c4c",
                // neutral70:"#dd4c4c",
                // neutral90:"#dd4c4c"
              }
            })}
          />
          <Select
            label="Year"
            name="year"
            className="formSelectFields col s12 form__field form__field--column form__field--minWidth300"
            type="select"
            onChange={this.handleSearchFilter}
            defaultValue={currentYear}
            placeholder="Choose Year"
            options={years}
            styles={
              this.props.settings &&
              this.props.settings.settings &&
              this.props.settings.settings.theme_option_id == 12
                ? reactSelectStylesPaginationThemeLight
                : reactSelectStylesPagination
            }
            theme={theme => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                //background
                // neutral0:"white",

                //border and divider of arrow - initial
                neutral20: '#2f3c63',

                //arrow down - after its not pristine
                neutral60: '#7f64e3',

                // no options text when user searching
                neutral40: 'orange',
                //chosen field on dropdown from previous
                primary: '#7f64e3',

                //highlight at hover
                primary25: '#e0d8fe',
                //Placeholder
                neutral50: '#8c8bcc',

                //selectd value text color
                neutral80: 'rgba(0,0,0,0.87)',
                //hover over container
                neutral30: '#7f64e3'

                // neutral5:"#dd4c4c",
                // neutral10:"#dd4c4c",
                //
                // primay50:"#dd4c4c",
                // neutral70:"#dd4c4c",
                // neutral90:"#dd4c4c"
              }
            })}
          />
        </div>
        {/*
        <div className="searchbox">
          <p>
            <label>
              <input
                name="group1"
                type="radio"
                value="dateDelivered"
                checked={this.state.selectedAccountType === "dateDelivered"}
                onChange={this.handleOptionChange}
              />
              <span>Date Delivered</span>
            </label>
          </p>
          <p>
            <label>
              <input
                name="group1"
                type="radio"
                value="datePaid"
                checked={this.state.selectedAccountType === "datePaid"}
                onChange={this.handleOptionChange}
              />
              <span>Date Paid</span>
            </label>
          </p>
        </div>
        */}
        {this.state.summary ? (
          <ProfitLossStatementSummary
            currentstate={this.state}
            currentRef={el => (this.componentRef = el)}
          />
        ) : (
          <div
            className="profitlossContainer"
            ref={el => (this.componentRef = el)}>
            <h1>
              Profit & Loss{' '}
              {periodOptions.find(x => x.value == this.state.period).label} -{' '}
              {this.state.year}
            </h1>
            <h2>Revenue</h2>
            <section className="section factored">
              <h3>Factored</h3>

              <div>
                <h4> Rate Confirmation : </h4>
                <h4>
                  ${this.state.dataLoads.factored.rate_confirmation_amount}
                </h4>
              </div>
              <div>
                <h4> Load Reimbursement : </h4>
                <h4>${this.state.dataLoads.factored.load_reimbursement}</h4>
              </div>
              <div>
                <h4> Load Deduction : </h4>
                <h4>${this.state.dataLoads.factored.load_deduction}</h4>
              </div>
              <div>
                <h4> Other Deductions : </h4>
                <h4>${this.state.dataLoads.factored.other_deduction}</h4>
              </div>
              <div>
                <h4> Other Reimbursement : </h4>
                <h4>${this.state.dataLoads.factored.other_reimbursement}</h4>
              </div>
              <div>
                <h4> Total Factor Advanced : </h4>
                <h4>${this.state.dataLoads.factored.factor_total_advanced}</h4>
              </div>
              <div>
                <h4> Factor Fee Amount : </h4>
                <h4>${this.state.dataLoads.factored.factor_fee_amount}</h4>
              </div>
              <div>
                <h4> Factor Fee Other : </h4>
                <h4>${this.state.dataLoads.factored.factor_fee_other}</h4>
              </div>
              <div>
                <h4> Fuel Advance : </h4>
                <h4>${this.state.dataLoads.factored.fuel_advance_amount}</h4>
              </div>

              <div>
                <h4> Fuel Advance Fee : </h4>
                <h4>${this.state.dataLoads.factored.fuel_advance_fee}</h4>
              </div>
              <div>
                <h4> Reserves Currently Held : </h4>
                <h4>
                  $
                  {parseFloat(
                    this.state.dataLoads.factored.factor_reserve_held
                  ).toFixed(2)}
                </h4>
              </div>
              <div>
                <h4> Reserves Paid Out : </h4>
                <h4>
                  ${this.state.dataLoads.factored.factor_reserve_amount_paid}
                </h4>
              </div>

              <div>
                <h4> Customer Paid :</h4>
                <h4>${this.state.dataLoads.factored.customer_paid_amount}</h4>
              </div>
              <div className="grossContainer">
                <div className="grossRevenue">
                  <h4> Gross Revenue :</h4>
                  <h4>
                    $
                    {parseFloat(
                      this.state.dataLoads.factored.factor_total_advanced +
                        this.state.dataLoads.factored.factor_fee_amount +
                        this.state.dataLoads.factored.factor_fee_other +
                        this.state.dataLoads.factored.fuel_advance_amount +
                        this.state.dataLoads.factored.fuel_advance_fee +
                        this.state.dataLoads.factored
                          .factor_reserve_amount_paid +
                        this.state.dataLoads.factored.other_deduction +
                        this.state.dataLoads.factored.load_deduction
                    ).toFixed(2)}
                  </h4>
                </div>
                <div className="grossDeductions">
                  <h4> Total Fees :</h4>
                  <h4>
                    $
                    {this.state.dataLoads.factored.factor_fee_amount +
                      this.state.dataLoads.factored.factor_fee_other +
                      this.state.dataLoads.factored.fuel_advance_fee +
                      this.state.dataLoads.factored.other_deduction +
                      this.state.dataLoads.factored.load_deduction}
                  </h4>
                </div>

                <div className="income">
                  <h4>Income before taxes :</h4>
                  <h4>
                    $
                    {(
                      parseFloat(
                        this.state.dataLoads.factored.factor_total_advanced +
                          this.state.dataLoads.factored.factor_fee_amount +
                          this.state.dataLoads.factored.factor_fee_other +
                          this.state.dataLoads.factored.fuel_advance_amount +
                          this.state.dataLoads.factored.fuel_advance_fee +
                          this.state.dataLoads.factored
                            .factor_reserve_amount_paid
                      ) -
                      (this.state.dataLoads.factored.factor_fee_amount +
                        this.state.dataLoads.factored.factor_fee_other +
                        this.state.dataLoads.factored.fuel_advance_fee)
                    ).toFixed(2)}
                  </h4>
                </div>
              </div>
              <p>
                * Gross Revenue based on Factor Advanced+Factor Fee+Factor Fee
                Other+Fuel Adv Fee+Fuel Adv+Reserves paid.
              </p>
              <p>
                Total Deductions : Factor Fee + Factor Fee Other + Fuel Adv Fee
              </p>
            </section>

            <section className="section notfactored">
              <h3>Not Factored</h3>
              <div>
                <h4> Rate Confirmation: </h4>
                <h4>
                  ${this.state.dataLoads.notfactored.rate_confirmation_amount}
                </h4>
              </div>
              <div>
                <h4>Load Reimbursement: </h4>
                <h4>${this.state.dataLoads.notfactored.load_reimbursement}</h4>
              </div>
              <div>
                <h4> Load Deduction: </h4>
                <h4>${this.state.dataLoads.notfactored.load_deduction}</h4>
              </div>

              <div>
                <h4>Customer Quickpay Fees: </h4>
                <h4>
                  ${this.state.dataLoads.notfactored.customer_quickpay_fee}
                </h4>
              </div>
              <div>
                <h4>Customer Paid : </h4>
                <h4>
                  ${this.state.dataLoads.notfactored.customer_paid_amount}
                </h4>
              </div>
              <div className="grossContainer">
                <div className="grossRevenue">
                  <h4> Not Factored Revenue :</h4>
                  <h4>
                    $
                    {this.state.dataLoads.notfactored.customer_paid_amount +
                      this.state.dataLoads.notfactored.customer_quickpay_fee +
                      this.state.dataLoads.notfactored.load_deduction}
                  </h4>
                </div>
                <div className="grossDeductions">
                  <h4> Not Factored Deductions :</h4>
                  <h4>
                    $
                    {this.state.dataLoads.notfactored.customer_quickpay_fee +
                      this.state.dataLoads.notfactored.load_deduction}
                  </h4>
                </div>
                <div className="income">
                  <h4>Income Before Taxes :</h4>
                  <h4>
                    $
                    {this.state.dataLoads.notfactored.customer_paid_amount +
                      this.state.dataLoads.notfactored.customer_quickpay_fee +
                      this.state.dataLoads.notfactored.load_deduction -
                      (this.state.dataLoads.notfactored.customer_quickpay_fee +
                        this.state.dataLoads.notfactored.load_deduction)}
                  </h4>
                </div>
              </div>
              <p>
                *Revenue based on Rate confirmation + Customer quickpay fees
                <br /> Rate confirmation+ Load Reimbursments - Load Deductions -
                Customer Quickpay fees SHOULD equal customer paid <br />
              </p>
              <p>*Deductions are customer quickpay fees.</p>
            </section>
          </div>
        )}
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
    expenses: state.expense,
    settings: state.settings
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
)(ProfitLoss)
