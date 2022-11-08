import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { NavLink, Link } from 'react-router-dom'

import { fetchDrivers } from '../../actions/driver/fetchDrivers.js'
import { getUserInfo } from '../../actions/user/getUserInfo.js'
import { fetchUserSettings } from '../../actions/user/fetchUserSettings.js'
import { fetchProfile } from '../../actions/company/fetchProfile.js'
import { fetchCustomers } from '../../actions/customer/fetchCustomers.js'
import { fetchTrucks } from '../../actions/truck/fetchTrucks.js'
import { createBrowserHistory } from 'history'
const customHistory2 = createBrowserHistory()

class NavBarNew extends Component {
  constructor() {
    super()
    this.state = {
      currentLocation: '',
      locationTitle: '',
      smallHeader: false,
      editHeader: false,
      backLink: '',
      open: false
    }
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
    this.props.getUserInfo()
    this.props.fetchUserSettings()
    this.props.fetchProfile()
    this.props.fetchDrivers()
    this.props.fetchCustomers()
    this.props.fetchTrucks()

    setTimeout(() => {
      var elemsSideNav = document.querySelectorAll('.sidenav')
      var instancesSideNav = M.Sidenav.init(elemsSideNav)
      var collapsibleElem = document.querySelector('.collapsible')
      var collapsibleInstance = M.Collapsible.init(collapsibleElem)
      // let dropdowns = document.querySelectorAll('.dropdown-trigger')
      // let dropdownInstance = M.Dropdown.init(dropdowns)
    }, 0)
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }
  handleClickOutside = event => {
    if (
      this.containerprofile &&
      !this.containerprofile.contains(event.target)
    ) {
      this.setState({
        open: false
      })
    }
  }

  // this.props.fetchAllLoadsDetails();

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentLocation !== this.props.history.location.pathname) {
      let currentLocation = this.props.history.location.pathname
      let locationTitle
      let smallHeader
      let editHeader
      let backLink

      if (currentLocation == '/loads/loadboard') {
        locationTitle = 'LoadBoard'
        smallHeader = false
      } else if (currentLocation == '/loads/addnew') {
        locationTitle = 'Load - Add New'
        smallHeader = true
        backLink = '/loads/loadboard'
      } else if (currentLocation == '/loads/edit') {
        locationTitle = `${
          this.props.selectedLoad && this.props.selectedLoad.customer
            ? this.props.selectedLoad.customer.customer_name +
              ' #' +
              this.props.selectedLoad.invoice_id
            : ''
        } - Edit`
        smallHeader = true
        editHeader = true
        backLink = '/loads/loadboard'
      } else if (currentLocation == '/customers/addnew') {
        locationTitle = 'Customer - Add New'
        smallHeader = true
        backLink = '/customers/search'
      } else if (currentLocation == '/customers/viewCustomer') {
        locationTitle = `Customer : ${
          this.props.customer.selectedCustomer.customer_name
        }`
        smallHeader = true
        backLink = '/customers/search'
      } else if (currentLocation == '/customers/edit') {
        locationTitle = `Customer : ${
          this.props.customer.selectedCustomer.customer_name
        }`
        smallHeader = true
        editHeader = true
        backLink = '/customers/search'
      } else if (currentLocation == '/customers/search') {
        locationTitle = 'Customers'
        smallHeader = false
      } else if (currentLocation == '/customers/pastloads') {
        locationTitle = 'Customer - Past Loads'
        smallHeader = false
      } else if (currentLocation == '/drivers/addnew') {
        locationTitle = 'Driver - Add New'
        smallHeader = true
        backLink = '/drivers/search'
      } else if (currentLocation == '/drivers/search') {
        locationTitle = 'Drivers'
        smallHeader = false
      } else if (currentLocation == '/drivers/view') {
        locationTitle = `Driver : ${
          this.props.driver.selectedDriver.driver_first_name
        } ${this.props.driver.selectedDriver.driver_last_name}`
        smallHeader = true
        backLink = '/drivers/search'
      } else if (currentLocation == '/drivers/edit') {
        locationTitle = `Driver : ${
          this.props.driver.selectedDriver.driver_first_name
        } ${this.props.driver.selectedDriver.driver_last_name}`
        smallHeader = true
        editHeader = true
        backLink = '/drivers/search'
      } else if (currentLocation == '/drivers/pastloads') {
        locationTitle = 'Driver - Past Loads'
        smallHeader = false
      } else if (currentLocation == '/trucks/trucklist') {
        locationTitle = 'Trucks'
        smallHeader = false
      } else if (currentLocation == '/trucks/addnew') {
        locationTitle = 'Truck - Add New'
        smallHeader = true
        backLink = '/trucks/trucklist'
      } else if (currentLocation == '/trailers/trailerlist') {
        locationTitle = 'Trailers'
        smallHeader = false
      } else if (currentLocation == '/trailers/addnew') {
        locationTitle = 'Trailer - Add New'
        smallHeader = true
        backLink = '/trailers/trailerlist'
      } else if (currentLocation == '/vendors/vendorList') {
        locationTitle = 'Vendors'
        smallHeader = false
      } else if (currentLocation == '/vendors/vendorAddNew') {
        locationTitle = 'Vendor - Add New'
        smallHeader = true
      } else if (currentLocation == '/subCategory/list') {
        locationTitle = 'Sub-Categories'
        smallHeader = false
      } else if (currentLocation == '/subCategory/addNew') {
        locationTitle = 'Sub-Category - Add New'
        smallHeader = true
      } else if (currentLocation == '/category/categoryExpenseList') {
        locationTitle = 'Categories'
        smallHeader = false
      } else if (currentLocation == '/category/addNew') {
        locationTitle = 'Category - Add New'
        smallHeader = true
      } else if (currentLocation == '/expense/expenseList') {
        locationTitle = 'Expenses'
        smallHeader = false
      } else if (currentLocation == '/expense/edit') {
        locationTitle = 'Expenses-Edit'
        smallHeader = false
        backLink = '/expense/expenseList'
      } else if (currentLocation == '/expense/expenseAddNew') {
        locationTitle = 'Expense - Add New'
        smallHeader = true
        backLink = '/expense/expenseList'
      } else if (currentLocation == '/profile') {
        locationTitle = 'Profile'
        smallHeader = true
      } else if (currentLocation == '/profile/addnew') {
        locationTitle = 'Add Profile'
        smallHeader = true
      } else if (currentLocation == '/profile/edit') {
        locationTitle = 'Edit Profile'
        editHeader = true
        smallHeader = true
      } else if (currentLocation == '/accounting/loads') {
        locationTitle = 'Accounting - Loads'
        smallHeader = false
      } else if (currentLocation == '/accounting/edit') {
        locationTitle = `${
          this.props.selectedLoad && this.props.selectedLoad.customer
            ? this.props.selectedLoad.customer.customer_name +
              ' #' +
              this.props.selectedLoad.invoice_id
            : ''
        } - Edit`
        smallHeader = true
        editHeader = true
        backLink = '/accounting/loads'
      } else if (currentLocation == '/accounting/Drivers') {
        locationTitle = 'Accounting - Drivers'
        smallHeader = false
      } else if (currentLocation == '/accounting/driversPayrollEdit') {
        locationTitle = 'Accounting - Driver Payroll Edit'
        smallHeader = false
        editHeader = true
      } else if (currentLocation == '/reports') {
        locationTitle = 'Reports'
        smallHeader = false
      } else if (currentLocation == '/purchases/search') {
        locationTitle = 'Past Purchases'
        smallHeader = true
      }
      this.setState({
        currentLocation,
        locationTitle,
        smallHeader,
        editHeader,
        backLink
      })
    }

    // console.log('pls',window.location.pathname)

    if (prevProps.user !== this.props.user) {
      var elemsSideNav = document.querySelectorAll('.sidenav')
      var instancesSideNav = M.Sidenav.init(elemsSideNav)
      var collapsibleElem = document.querySelectorAll('.collapsible')
      var collapsibleInstance = M.Collapsible.init(collapsibleElem)
      let dropdowns = document.querySelectorAll('.dropdown-trigger')
      let dropdownInstance = M.Dropdown.init(dropdowns)
    }
  }

  handleButtonClick = () => {
    this.setState(state => {
      return {
        open: !state.open
      }
    })
  }

  render() {
    if (!this.props.user) {
      return (
        <div>
          <h1>loading</h1>
          <a href="/logout">Logout</a>
        </div>
      )
    } else if (this.props.company === null || this.props.company === '') {
      const { first_name, last_name } = this.props.user
      return (
        <section id="nav" className="navigation">
          <div className="user-group">
            <h1>{first_name}</h1>
            <h2 className="user-group__companyName">
              {this.props.company ? (
                this.props.company.company_name ||
                this.props.company.company_bill_name
              ) : (
                <NavLink
                  to="/profile"
                  activeClassName="selected"
                  className="add-company">
                  Add Your Company!
                </NavLink>
              )}
            </h2>
            <a className="logout" href="/logout">
              Logout
            </a>
          </div>
          <div className="left-sidebar" />
        </section>
      )
    } else {
      const { first_name, last_name } = this.props.user

      return (
        <div className="topNavBar">
          <nav
            className={
              this.state.smallHeader && this.state.editHeader
                ? 'topNavBar__nav topNavBar__nav--height100 topNavBar__nav--edit'
                : this.state.smallHeader == false
                  ? 'topNavBar__nav topNavBar__nav--height100'
                  : this.state.smallHeader
                    ? 'topNavBar__nav topNavBar__nav--height100'
                    : 'topNavBar__nav'
            }>
            <div className="nav-wrapper">
              <a href="#!" className="topNavBar__sectionTitle center">
                {this.state.locationTitle}
              </a>
              {this.state.backLink ? (
                <div className="topNavBar__backLinkContainer center">
                  <Link
                    to={this.state.backLink}
                    className="topNavBar__backLink">
                    {' '}
                    Go Back
                  </Link>
                </div>
              ) : null}

              {/*
              <a href="#" data-target="mobile-demo" className="sidenav-trigger">
                <i className="material-icons">menu</i>
              </a>
              */}
              <ul className="topNavBar__accountIcon right">
                <li>
                  <div
                    className="containerprofile"
                    ref={input => {
                      this.containerprofile = input
                    }}>
                    <a className="button1" onClick={this.handleButtonClick}>
                      <i className="material-icons topNavBar__icon">
                        account_circle
                      </i>
                    </a>
                    {this.state.open && (
                      <ul className="profile-dropdown">
                        <li>
                          <NavLink
                            to="/profile"
                            className="topNavBar__link"
                            activeClassName="selected">
                            Profile
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/settings"
                            className="topNavBar__link"
                            activeClassName="selected">
                            Settings
                          </NavLink>
                        </li>
                        <li>
                          <NavLink
                            to="/purchases/search"
                            className="topNavBar__link"
                            activeClassName="selected">
                            Purchases
                          </NavLink>
                        </li>
                        <li className="divider" />
                        <li>
                          <div className="user-group">
                            <a className="topNavBar__logout" href="/logout">
                              {first_name} : Logout
                            </a>
                          </div>
                        </li>
                      </ul>
                    )}
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      )
    }
  }
}
function mapStatetoProps(state) {
  return {
    user: state.user,
    customer: state.customers,
    company: state.company,
    driver: state.drivers,
    settings: state.settings,
    selectedLoad: state.loads.selectedLoad
  }
}
export default connect(
  mapStatetoProps,
  {
    getUserInfo,
    fetchUserSettings,
    fetchProfile,
    fetchCustomers,
    fetchDrivers,
    fetchTrucks
  },
  undefined,
  { pure: false }
)(NavBarNew)
