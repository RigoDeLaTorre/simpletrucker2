import _ from 'lodash'
import React, { Component } from 'react'

import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectedLoad, updateLoadStatus } from '../../actions/loads'
import { fetchAllLoadsDetails } from '../../actions/loads/fetchAllLoadsDetails.js'
import { toggleAlert } from '../../actions/alert/toggleAlert.js'
import { dateDiffInDays, getTodaysDate } from '../filterFunctions.js'

class AlertBar extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    setTimeout(() => {
      let modalAlert = document.querySelectorAll('.modalAlert')

      let modalAlertInstance = M.Modal.init(modalAlert)
    }, 0)
  }

  renderAlert = () => {
    let currentDate = new Date(getTodaysDate())

    let records = this.props.expenseRecords.filter(
      item =>
        item.expense_alert === 1 &&
        dateDiffInDays(new Date(item.date), currentDate) <=
          item.expense_alert_days
    )
    let drivers = this.props.drivers.filter(
      item =>
        dateDiffInDays(currentDate, new Date(item.driver_license_expiration)) <=
        30
    )

    if (drivers.length !== 0 && records.length !== 0) {
      return (
        <div className={this.props.alert ? 'alertBar themeLight' : 'alertBar'}>
          <h4 className="alertBar__alertTitle">*Alert*</h4>
          <div className="alertBar__subSection alertBar__subSection--left">
            <Link to="/drivers/search" className="alertBar__title">
              Drivers
            </Link>
            <span className="alertBar__span">{drivers.length}</span>
          </div>
          <div className="alertBar__subSection">
            <Link to="/expense/expenseList" className="alertBar__title">
              Expense
            </Link>

            <span className="alertBar__span">{records.length}</span>
          </div>
          <h4 className="alertBar__alertTitle">*Alert*</h4>
          <h4
            className="alertBar__dismissAlert"
            onClick={this.props.toggleAlert}>
            Dismiss Alert
          </h4>
        </div>
      )
    } else if (drivers.length !== 0) {
      return (
        <div className={this.props.alert ? 'alertBar themeLight' : 'alertBar'}>
          <h4 className="alertBar__alertTitle">*Alert*</h4>
          <div className="alertBar__subSection">
            <Link to="/drivers/search" className="alertBar__title">
              Drivers
            </Link>
            <span className="alertBar__span">{drivers.length}</span>
          </div>
          <h4 className="alertBar__alertTitle">*Alert*</h4>
          <h4
            className="alertBar__dismissAlert"
            onClick={this.props.toggleAlert}>
            Dismiss Alert
          </h4>
        </div>
      )
    } else if (records.length !== 0) {
      return (
        <div className={this.props.alert ? 'alertBar themeLight' : 'alertBar'}>
          <h4 className="alertBar__alertTitle">*Alert*</h4>
          <div className="alertBar__subSection">
            <Link to="/expense/expenseList" className="alertBar__title">
              Expense
            </Link>
            <span className="alertBar__span">{records.length}</span>
          </div>
          <h4 className="alertBar__alertTitle">*Alert*</h4>
          <h4
            className="alertBar__dismissAlert"
            onClick={this.props.toggleAlert}>
            Dismiss Alert
          </h4>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    return (
      <section
        id="alertBar"
        style={this.props.alert ? { display: 'block' } : { display: 'none' }}>
        {this.renderAlert()}
      </section>
    )
  }
}

function mapStatetoProps(state) {
  return {
    alert: state.alert,
    loads: state.loads || [],
    expenseRecords: state.expense.expenseRecords || [],
    drivers: state.drivers.drivers || []
  }
}
export default connect(
  mapStatetoProps,
  {
    toggleAlert,
    selectedLoad,
    updateLoadStatus,
    fetchAllLoadsDetails
  }
)(AlertBar)
