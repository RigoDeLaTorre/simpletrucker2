import React from "react"
import { NavLink, Link } from 'react-router-dom'

const DriverNav = ()=>(
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
            {/*
            <h2 className="user-group__theme" onClick={()=>this.props.updateUserSettings(1)}>Dark Theme<i className="tiny material-icons material-icons__checkbox">{this.props.settings.settings.theme_option_id ===1 ? "check_box" : "check_box_outline_blank"}</i></h2>
            <h2 className="user-group__theme" onClick={()=>this.props.updateUserSettings(2)}>Light Theme<i className="tiny material-icons material-icons__checkbox">{this.props.settings.settings.theme_option_id ===2 ? "check_box" : "check_box_outline_blank"}</i></h2>
            <h2 className="user-group__theme" onClick={()=>this.props.updateUserSettings(3)}>Light Theme<i className="tiny material-icons material-icons__checkbox">{this.props.settings.settings.theme_option_id ===3 ? "check_box" : "check_box_outline_blank"}</i></h2>
            */}
            <h2 className="user-group__companyName">
            compnay name replacement
            </h2>
          </div>
        </li>

        <li>
          <div className="collapsible-header">
            <i className="material-icons left">dashboard</i>Loads
          </div>
          <div className="collapsible-body">
            <ul>
              <li>
                {' '}
                <NavLink
                  to="/loads/loadboard"
                  className="nav-section__link nav-section__link--flex"
                  activeClassName="selected">
                  Load Board
                </NavLink>
              </li>
              <li>
                {' '}
                <NavLink
                  to="/loads/addnew"
                  className="nav-section__link nav-section__link--lessPadding"
                  activeClassName="selected">
                  Add New Load
                </NavLink>
              </li>
            </ul>
          </div>
        </li>

        <li>
          <div className="collapsible-header">
            <i className="material-icons left">people</i>Customers
          </div>
          <div className="collapsible-body">
            <ul>
              <li>
                <NavLink
                  to="/customers/search"
                  className="nav-section__link nav-section__link--flex"
                  activeClassName="selected">
                  Customers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/customers/addnew"
                  className="nav-section__link nav-section__link--lessPadding"
                  activeClassName="selected">
                  Add New Customer
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
            </ul>
          </div>
        </li>

        <li>
          <div className="collapsible-header">
            {' '}
            <h4 className="nav-section__sectionTitle">
              <img
                className="nav-section__titleIcon"
                src="/img/icons/driverIcon.svg"
              />{' '}
              Drivers
            </h4>
          </div>
          <div className="collapsible-body">
            <ul>
              <li>
                <NavLink
                  to="/drivers/search"
                  className="nav-section__link nav-section__link--flex"
                  activeClassName="selected">
                  Drivers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/drivers/addnew"
                  className="nav-section__link nav-section__link--lessPadding"
                  activeClassName="selected">
                  Add New Driver
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
            </ul>
          </div>
        </li>

        <li>
          <div className="collapsible-header">
            <i className="material-icons left">account_balance</i>Accounting
          </div>
          <div className="collapsible-body">
            <ul>
              <li>
                <NavLink
                  to="/accounting/loads"
                  className="nav-section__link"
                  activeClassName="selected">
                  Loads
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/accounting/Drivers"
                  className="nav-section__link"
                  activeClassName="selected">
                  Drivers Payroll
                </NavLink>
              </li>
            </ul>
          </div>
        </li>

        <li>
          <div className="collapsible-header">
            {' '}
            <h4 className="nav-section__sectionTitle">
              <img
                className="nav-section__titleIcon"
                src="/img/icons/truckIcon.svg"
              />Equipment
            </h4>
          </div>
          <div className="collapsible-body">
            <ul>
              <li>
                <NavLink
                  to="/trucks/trucklist"
                  className="nav-section__link nav-section__link--flex"
                  activeClassName="selected">
                  Trucks
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/trucks/addnew"
                  className="nav-section__link nav-section__link--lessPadding"
                  activeClassName="selected">
                  Add New Truck
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/trailers/trailerlist"
                  className="nav-section__link nav-section__link--flex"
                  activeClassName="selected">
                  Trailers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/trailers/addnew"
                  className="nav-section__link nav-section__link--lessPadding"
                  activeClassName="selected">
                  Add New Trailer
                </NavLink>
              </li>
            </ul>
          </div>
        </li>

        <li>
          <div className="collapsible-header">
            {' '}
            <i className="material-icons left">payment</i>Expenses
          </div>
          <div className="collapsible-body">
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
                    to="/expense/type/expenseTypeList"
                    className="nav-section__link nav-section__link--flex"
                    activeClassName="selected">
                    Sub-category
                  </NavLink>
                  <NavLink
                    to="/trucks/expenseListAddNew"
                    className="nav-section__link nav-section__link--lessPadding"
                    activeClassName="selected">
                    +
                  </NavLink>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>

      <ul className="desktop-nav">
        <li>
          <div className="user-group">

            <h1 className="user-group__logo">Simple Trucker</h1>

            <h2 className="user-group__companyName">
            replace with company name
            </h2>
          </div>
        </li>
        <li className="nav-section__group">
          <h4 className="nav-section__sectionTitle">
            <i className="material-icons left">dashboard</i>Loads
          </h4>

        </li>
        <li className="nav-section__group">
          <h4 className="nav-section__sectionTitle">
            <i className="material-icons left">people</i>Customers
          </h4>
          <div className="nav-section__linkGroup">
            <NavLink
              to="/customers/search"
              className="nav-section__link nav-section__link--flex"
              activeClassName="selected">
              Customer List
            </NavLink>
            <NavLink
              to="/customers/addnew"
              className="nav-section__link nav-section__link--lessPadding"
              activeClassName="selected">
              +
            </NavLink>
          </div>
          <NavLink
            to="/customers/pastloads"
            className="nav-section__link"
            activeClassName="selected">
            Past Loads
          </NavLink>
        </li>

        <li className="nav-section__group">
          <h4 className="nav-section__sectionTitle">
            <img
              className="nav-section__titleIcon"
              src="/img/icons/driverIcon.svg"
            />{' '}
            Drivers
          </h4>
          <div className="nav-section__linkGroup">
            <NavLink
              to="/drivers/search"
              className="nav-section__link nav-section__link--flex"
              activeClassName="selected">
              Driver List
            </NavLink>
            <NavLink
              to="/drivers/addnew"
              className="nav-section__link nav-section__link--lessPadding"
              activeClassName="selected">
              +
            </NavLink>
          </div>

          <NavLink
            to="/drivers/pastloads"
            className="nav-section__link"
            activeClassName="selected">
            Past Loads
          </NavLink>
        </li>

        <li className="nav-section__group">
          <h4 className="nav-section__sectionTitle">
            <i className="material-icons left">account_balance</i>Accounting
          </h4>

          <NavLink
            to="/accounting/Drivers"
            className="nav-section__link"
            activeClassName="selected">
            Drivers Payroll
          </NavLink>
        </li>


        {/*
        <li className="nav-section__group">
          <h4 className="nav-section__sectionTitle">
            <i className="material-icons left">business</i>Company
          </h4>

          <NavLink
            to="/profile"
            className="nav-section__link"
            activeClassName="selected">
            Profile
          </NavLink>
        </li>
                  */}
      </ul>
    </div>
  </section>

)

export default DriverNav
