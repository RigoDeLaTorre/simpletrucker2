import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { NavLink, Link } from 'react-router-dom'
import DriverNav from './DriverNav'
import Payments from '../Stripe/Payments'
import moment from 'moment'

import { updateUserSettings } from '../../actions/user/updateUserSettings.js'

// import { fetchDrivers } from "../../actions/driver/fetchDrivers.js";
// import { getUserInfo } from "../../actions/user/getUserInfo.js";
// import { fetchProfile } from "../../actions/company/fetchProfile.js";
// import { fetchCustomers } from "../../actions/customer/fetchCustomers.js";
// import { fetchTrucks } from "../../actions/truck/fetchTrucks.js";

class Nav extends Component {
  constructor() {
    super()
    this.state = {}
  }
  componentDidMount() {
    // this.props.getUserInfo();
    // this.props.fetchProfile();
    // this.props.fetchDrivers();
    // this.props.fetchCustomers();
    // this.props.fetchTrucks();

    setTimeout(() => {
      var elemsSideNav = document.querySelectorAll('.sidenav')
      var instancesSideNav = M.Sidenav.init(elemsSideNav)
      var collapsibleElem = document.querySelector('.collapsible')
      var collapsibleInstance = M.Collapsible.init(collapsibleElem)
    }, 0)
  }

  // this.props.fetchAllLoadsDetails();

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user !== this.props.user) {
      var elemsSideNav = document.querySelectorAll('.sidenav')
      var instancesSideNav = M.Sidenav.init(elemsSideNav)
      var collapsibleElem = document.querySelectorAll('.collapsible')
      var collapsibleInstance = M.Collapsible.init(collapsibleElem)
    }
  }

  testDate() {
    let checkTodaysDate = moment(new Date())
    let checkCompanyCreateDate = moment(this.props.company.created_at)

    let trial =
      moment.duration(checkTodaysDate.diff(checkCompanyCreateDate)).asDays() <=
      30
    if (!trial) {
      return null
    } else {
      let date = moment(this.props.company.created_at, 'YYYY-MM-DD').add(
        30,
        'days'
      )
      let newDate = moment(date, 'YYYY-MM-DD').format('MM-DD-YYYY')

      // date.add(5, 'days')
      return <h2 className="user-group__trial">Trial Ends : {newDate}</h2>
    }
  }
  render() {
    // console.log(moment(this.props.company.created_at, 'DD-MM-YYYY'))
    if (!this.props.user) {
      return (
        <div>
          <h1>loading</h1>
          <a href="/logout">Logout</a>
        </div>
      )
    }
    //  else if(this.props.user.user_role_id ===22){
    //     return <DriverNav />
    // }
    else if (
      this.props.user.company_id === null ||
      this.props.user.company_id === ''
    ) {
      const { first_name, last_name } = this.props.user
      return (
        <section id="nav" className="navigation">
          <div className="user-group">
            <h1 className="user-group__logo">Simple Trucker</h1>
            <h1>{first_name}</h1>
            <h2 className="user-group__companyName">
              <NavLink
                to="/profile/addnew"
                activeClassName="selected"
                className="add-company">
                Add Your Company!
              </NavLink>
            </h2>
          </div>
          <div className="left-sidebar" />
        </section>
      )
    } else {
      const { first_name, last_name } = this.props.user

      return (
        <section id="nav" className="navigation">
          <div className="sidenavTrigger-container">
            <a href="#" data-target="slide-out" className="sidenav-trigger">
              <i className="material-icons sidenav-trigger__icon">menu</i>
            </a>
          </div>

          <div className="nav-section">
            <ul id="slide-out" className="sidenav collapsible">
              <li>
                <div className="user-group">
                  <h1 className="user-group__logo">Simple Trucker</h1>
                  <h2 className="user-group__companyName">
                    {this.props.company.company_name ||
                      this.props.company.company_bill_name}
                  </h2>
                  {this.testDate()}
                  <h2 className="user-group__credits">
                    Credits:{this.props.company.credits}
                  </h2>
                  <Payments />
                </div>
              </li>
              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav">
                  <i className="material-icons left">dashboard</i>Loads
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      {' '}
                      <NavLink
                        to="/loads/loadboard"
                        className="nav-section__link"
                        activeClassName="selected">
                        Load Board
                      </NavLink>
                    </li>
                    <li>
                      {' '}
                      <NavLink
                        to="/loads/addnew"
                        className="nav-section__link"
                        activeClassName="selected">
                        Add New Load
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav">
                  <i className="material-icons left">people</i>Customers
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      <NavLink
                        to="/customers/search"
                        className="nav-section__link"
                        activeClassName="selected">
                        Customers
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/customers/pastloads"
                        className="nav-section__link"
                        activeClassName="selected">
                        Customer Past Loads
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/customers/addnew"
                        className="nav-section__link"
                        activeClassName="selected">
                        Add New Customer
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav">
                  <h4 className="nav-section__sectionTitle">
                    <img
                      className="nav-section__titleIcon nav-section__titleIcon--mobile"
                      src="/img/icons/driverIcon.svg"
                    />
                    Drivers
                  </h4>
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      <NavLink
                        to="/drivers/search"
                        className="nav-section__link"
                        activeClassName="selected">
                        Drivers
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/drivers/pastloads"
                        className="nav-section__link"
                        activeClassName="selected">
                        Driver Past Loads
                      </NavLink>
                    </li>

                    {/*
                    <li>
                      <a
                        href="/driver/showDrivers"
                        className="nav-section__link">
                        Driver Login Access
                      </a>
                    </li>
*/}
                    <li>
                      <NavLink
                        to="/drivers/addnew"
                        className="nav-section__link"
                        activeClassName="selected">
                        Add New Driver
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav">
                  <i className="material-icons left">account_balance</i>
                  Accounting
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      <NavLink
                        to="/accounting/loads"
                        className="nav-section__link"
                        activeClassName="selected">
                        Loads
                      </NavLink>
                    </li>
                    {/*
                    <li>
                      <NavLink
                        to="/accounting/Drivers"
                        className="nav-section__link"
                        activeClassName="selected"
                      >
                        Drivers Payroll
                      </NavLink>
                    </li>
                    */}
                  </ul>
                </div>
              </li>
              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav">
                  {' '}
                  <h4 className="nav-section__sectionTitle">
                    <img
                      className="nav-section__titleIcon nav-section__titleIcon--mobile"
                      src="/img/icons/truckIcon.svg"
                    />
                    Equipment
                  </h4>
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      <div className="nav-section__linkGroup">
                        <NavLink
                          to="/trucks/trucklist"
                          className="nav-section__link nav-section__link--flex"
                          activeClassName="selected">
                          Trucks
                        </NavLink>
                        <NavLink
                          to="/trucks/addnew"
                          className="nav-section__link nav-section__link--lessPadding"
                          activeClassName="selected">
                          +
                        </NavLink>
                      </div>
                    </li>

                    <li>
                      <div className="nav-section__linkGroup">
                        <NavLink
                          to="/trailers/trailerlist"
                          className="nav-section__link nav-section__link--flex"
                          activeClassName="selected">
                          Trailers
                        </NavLink>
                        <NavLink
                          to="/trailers/addnew"
                          className="nav-section__link nav-section__link--lessPadding"
                          activeClassName="selected">
                          +
                        </NavLink>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>

              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav">
                  {' '}
                  <i className="material-icons left">payment</i>
                  <h4>Expenses</h4>
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      <div className="nav-section__linkGroup">
                        <NavLink
                          to="/expense/expenseList"
                          className="nav-section__link nav-section__link--flex"
                          activeClassName="selected">
                          Expenses
                        </NavLink>
                        <NavLink
                          to="/expense/expenseAddNew"
                          className="nav-section__link nav-section__link--lessPadding"
                          activeClassName="selected">
                          +
                        </NavLink>
                      </div>
                    </li>
                    <li>
                      <div className="nav-section__linkGroup">
                        <NavLink
                          to="/vendors/vendorList"
                          className="nav-section__link nav-section__link--flex"
                          activeClassName="selected">
                          Vendors
                        </NavLink>
                        <NavLink
                          to="/vendors/vendorAddNew"
                          className="nav-section__link nav-section__link--lessPadding"
                          activeClassName="selected">
                          +
                        </NavLink>
                      </div>
                    </li>
                    <li>
                      <div className="nav-section__linkGroup">
                        <NavLink
                          to="/category/categoryExpenseList"
                          className="nav-section__link nav-section__link--flex"
                          activeClassName="selected">
                          Category
                        </NavLink>
                        <NavLink
                          to="/category/addNew"
                          className="nav-section__link nav-section__link--lessPadding"
                          activeClassName="selected">
                          +
                        </NavLink>
                      </div>
                    </li>
                    <li>
                      <div className="nav-section__linkGroup">
                        <NavLink
                          to="/subCategory/list"
                          className="nav-section__link nav-section__link--flex"
                          activeClassName="selected">
                          Sub-category
                        </NavLink>
                        <NavLink
                          to="/subCategory/addNew"
                          className="nav-section__link nav-section__link--lessPadding"
                          activeClassName="selected">
                          +
                        </NavLink>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>

              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav collapsibleHeader--marginTop2">
                  <i className="material-icons left">assessment</i>Reports
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      {' '}
                      <NavLink
                        to="/reports/dashboard"
                        className="nav-section__link"
                        activeClassName="selected">
                        Dashboard
                      </NavLink>
                    </li>
                    {/*
                    <li>
                      {' '}
                      <NavLink
                        to="/reports/expenses"
                        className="nav-section__link"
                        activeClassName="selected">
                        Expenses
                      </NavLink>
                    </li>

                    */}
                    <li>
                      {' '}
                      <NavLink
                        to="/reports/profitloss"
                        className="nav-section__link"
                        activeClassName="selected">
                        Profit / Loss
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>

              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav">
                  <i className="material-icons left">settings</i>Settings
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      {' '}
                      <NavLink
                        to="/settings"
                        className="nav-section__link"
                        activeClassName="selected">
                        Themes
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>

            <ul className="desktop-nav collapsible collapsible__desktopNav">
              <li>
                <div className="user-group">
                  <h1 className="user-group__logo">Simple Trucker</h1>
                  <h2 className="user-group__companyName">
                    {this.props.company.company_name ||
                      this.props.company.company_bill_name}
                  </h2>
                  {this.testDate()}
                  <h2 className="user-group__credits">
                    Credits:{this.props.company.credits}
                  </h2>
                  <Payments />
                </div>
              </li>
              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav">
                  <i className="material-icons left">dashboard</i>Loads
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      {' '}
                      <NavLink
                        to="/loads/loadboard"
                        className="nav-section__link"
                        activeClassName="selected">
                        Load Board
                      </NavLink>
                    </li>
                    <li>
                      {' '}
                      <NavLink
                        to="/loads/addnew"
                        className="nav-section__link"
                        activeClassName="selected">
                        Add New Load
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav">
                  <i className="material-icons left">people</i>Customers
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      <NavLink
                        to="/customers/search"
                        className="nav-section__link"
                        activeClassName="selected">
                        Customers
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/customers/pastloads"
                        className="nav-section__link"
                        activeClassName="selected">
                        Customer Past Loads
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/customers/addnew"
                        className="nav-section__link"
                        activeClassName="selected">
                        Add New Customer
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav">
                  <h4 className="nav-section__sectionTitle">
                    <img
                      className="nav-section__titleIcon nav-section__titleIcon--mobile"
                      src="/img/icons/driverIcon.svg"
                    />
                    Drivers
                  </h4>
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      <NavLink
                        to="/drivers/search"
                        className="nav-section__link"
                        activeClassName="selected">
                        Drivers
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to="/drivers/pastloads"
                        className="nav-section__link"
                        activeClassName="selected">
                        Driver Past Loads
                      </NavLink>
                    </li>

                    {/*
                    <li>
                      <a
                        href="/driver/showDrivers"
                        className="nav-section__link">
                        Driver Login Access
                      </a>
                    </li>
*/}
                    <li>
                      <NavLink
                        to="/drivers/addnew"
                        className="nav-section__link"
                        activeClassName="selected">
                        Add New Driver
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav">
                  <i className="material-icons left">account_balance</i>
                  Accounting
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      <NavLink
                        to="/accounting/loads"
                        className="nav-section__link"
                        activeClassName="selected">
                        Loads
                      </NavLink>
                    </li>
                    {/*
                    <li>
                      <NavLink
                        to="/accounting/Drivers"
                        className="nav-section__link"
                        activeClassName="selected"
                      >
                        Drivers Payroll
                      </NavLink>
                    </li>
                    */}
                  </ul>
                </div>
              </li>
              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav">
                  {' '}
                  <h4 className="nav-section__sectionTitle">
                    <img
                      className="nav-section__titleIcon nav-section__titleIcon--mobile"
                      src="/img/icons/truckIcon.svg"
                    />
                    Equipment
                  </h4>
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      <div className="nav-section__linkGroup">
                        <NavLink
                          to="/trucks/trucklist"
                          className="nav-section__link nav-section__link--flex"
                          activeClassName="selected">
                          Trucks
                        </NavLink>
                        <NavLink
                          to="/trucks/addnew"
                          className="nav-section__link nav-section__link--lessPadding"
                          activeClassName="selected">
                          +
                        </NavLink>
                      </div>
                    </li>

                    <li>
                      <div className="nav-section__linkGroup">
                        <NavLink
                          to="/trailers/trailerlist"
                          className="nav-section__link nav-section__link--flex"
                          activeClassName="selected">
                          Trailers
                        </NavLink>
                        <NavLink
                          to="/trailers/addnew"
                          className="nav-section__link nav-section__link--lessPadding"
                          activeClassName="selected">
                          +
                        </NavLink>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>

              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav">
                  {' '}
                  <i className="material-icons left">payment</i>
                  <h4>Expenses</h4>
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      <div className="nav-section__linkGroup">
                        <NavLink
                          to="/expense/expenseList"
                          className="nav-section__link nav-section__link--flex"
                          activeClassName="selected">
                          Expenses
                        </NavLink>
                        <NavLink
                          to="/expense/expenseAddNew"
                          className="nav-section__link nav-section__link--lessPadding"
                          activeClassName="selected">
                          +
                        </NavLink>
                      </div>
                    </li>
                    <li>
                      <div className="nav-section__linkGroup">
                        <NavLink
                          to="/vendors/vendorList"
                          className="nav-section__link nav-section__link--flex"
                          activeClassName="selected">
                          Vendors
                        </NavLink>
                        <NavLink
                          to="/vendors/vendorAddNew"
                          className="nav-section__link nav-section__link--lessPadding"
                          activeClassName="selected">
                          +
                        </NavLink>
                      </div>
                    </li>
                    <li>
                      <div className="nav-section__linkGroup">
                        <NavLink
                          to="/category/categoryExpenseList"
                          className="nav-section__link nav-section__link--flex"
                          activeClassName="selected">
                          Category
                        </NavLink>
                        <NavLink
                          to="/category/addNew"
                          className="nav-section__link nav-section__link--lessPadding"
                          activeClassName="selected">
                          +
                        </NavLink>
                      </div>
                    </li>
                    <li>
                      <div className="nav-section__linkGroup">
                        <NavLink
                          to="/subCategory/list"
                          className="nav-section__link nav-section__link--flex"
                          activeClassName="selected">
                          Sub-category
                        </NavLink>
                        <NavLink
                          to="/subCategory/addNew"
                          className="nav-section__link nav-section__link--lessPadding"
                          activeClassName="selected">
                          +
                        </NavLink>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>

              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav collapsibleHeader--marginTop2">
                  <i className="material-icons left">assessment</i>Reports
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      {' '}
                      <NavLink
                        to="/reports/dashboard"
                        className="nav-section__link"
                        activeClassName="selected">
                        Dashboard
                      </NavLink>
                    </li>
                    {/*
                    <li>
                      {' '}
                      <NavLink
                        to="/reports/expenses"
                        className="nav-section__link"
                        activeClassName="selected">
                        Expenses
                      </NavLink>
                    </li>

                    */}
                    <li>
                      {' '}
                      <NavLink
                        to="/reports/profitloss"
                        className="nav-section__link"
                        activeClassName="selected">
                        Profit / Loss
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>

              <li>
                <div className="collapsible-header collapsibleHeader__desktopNav">
                  <i className="material-icons left">settings</i>Settings
                </div>
                <div className="collapsible-body collapsibleBody__desktopNav">
                  <ul>
                    <li>
                      {' '}
                      <NavLink
                        to="/settings"
                        className="nav-section__link"
                        activeClassName="selected">
                        Themes
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </section>
      )
    }
  }
}
function mapStatetoProps(state) {
  return {
    user: state.user,
    company: state.company,
    settings: state.settings
  }
}
export default connect(
  mapStatetoProps,
  {
    updateUserSettings
  },
  undefined,
  { pure: false }
)(Nav)
