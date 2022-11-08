// import 'materialize-css/dist/js/materialize.min.js'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { Router, Route, Switch, Link } from 'react-router-dom'
import history from './history'
import rootReducer from './reducers'
import LoadingComponent from './components/LoadingComponent'
import Nav from './components/Nav/Nav.js'
import MainContainer from './components/MainContainer.js'
import Profile from './components/Profile/Profile'
import ProfileAddNew from './components/Profile/ProfileAddNew'
import LoginWelcome from './components/LoginWelcome'

import Checkout from './components/Checkout/Checkout.js'

import LoadBoard from './components/Loads/LoadBoard'
import AddLoad from './components/Loads/AddLoad'
import LoadView from './components/Loads/LoadView'
import EditLoad from './components/Loads/EditLoad'

import DriverAddNew from './components/Driver/DriverAddNew'
import DriverSearch from './components/Driver/DriverSearch'
import DriverEdit from './components/Driver/DriverEdit'
import DriverPastLoads from './components/Driver/DriverPastLoads'
import DriverView from './components/Driver/DriverView'

import CustomerSearch from './components/Customer/CustomerSearch'
import CustomerViewTabular from './components/Customer/CustomerViewTabular'
import CustomerAddNew from './components/Customer/CustomerAddNew'
import CustomerAddNewTabular from './components/Customer/CustomerAddNewTabular'
import CustomerEdit from './components/Customer/CustomerEdit'
import CustomerEditTabular from './components/Customer/CustomerEditTabular'
import CustomerPastLoads from './components/Customer/CustomerPastLoads'

import TruckList from './components/Trucks/TruckList'
import TruckAddNew from './components/Trucks/TruckAddNew'

import ExpenseList from './components/Expenses/ExpenseList'
import ExpenseAddNew from './components/Expenses/ExpenseAddNew'
import ExpenseEdit from './components/Expenses/ExpenseEdit'
import ExpenseView from './components/Expenses/ExpenseView'

import TrailerList from './components/Trailer/TrailerList'
import TrailerAddNew from './components/Trailer/TrailerAddNew'

import AccountingEditLoad from './components/Accounting/AccountingEditLoad'
import LoadAccounting from './components/Accounting/LoadAccounting'
import AccountingDrivers from './components/Accounting/AccountingDrivers'
import AccountingDriversPayMultipleEdit from './components/Accounting/AccountingDriversPayMultipleEdit'

import ReportsHome from './components/Reports/ReportsHome'
import ReportsExpenses from './components/Reports/ReportsExpenses'
import ProfitLoss from './components/Reports/ProfitLoss'

import VendorList from './components/Vendors/VendorList'
import VendorAddNew from './components/Vendors/VendorAddNew'

import CategoryExpenseList from './components/CategoryExpense/CategoryExpenseList'
import CategoryAddNew from './components/CategoryExpense/CategoryAddNew'

import ExpenseTypeList from './components/CategoryExpenseTypes/ExpenseTypeList'
import SubCategoryAddNew from './components/CategoryExpenseTypes/SubCategoryAddNew'
import NavBarNew from './components/Nav/NavBarNew'
import AlertBar from './components/AlertBar/AlertBar'
import UserSettings from './components/UserSettings/UserSettings'

const initialState = {}
const middleware = [thunk]

const store = createStore(
  rootReducer,
  initialState,
  // compose(applyMiddleware(...middleware))
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <div id="home">
          <Nav />
          <Switch>
            <MainContainer>
              <NavBarNew history={history} />
              <AlertBar />
              <Route path="/purchases/search" component={Checkout} />
              <Route path="/home" component={LoginWelcome} />
              <Route path="/loads/addnew" component={AddLoad} />
              <Route path="/loads/edit" component={EditLoad} />
              <Route path="/loads/loadview" component={LoadView} />
              <Route path="/loads/loadboard" component={LoadBoard} />

              <Route
                path="/customers/addnew"
                component={CustomerAddNewTabular}
              />
              <Route path="/customers/edit" component={CustomerEditTabular} />
              <Route path="/customers/search" component={CustomerSearch} />
              <Route
                path="/customers/pastloads"
                component={CustomerPastLoads}
              />
              <Route
                path="/customers/viewCustomer"
                component={CustomerViewTabular}
              />

              <Route path="/drivers/addnew" component={DriverAddNew} />
              <Route path="/drivers/search" component={DriverSearch} />
              <Route path="/drivers/edit" component={DriverEdit} />
              <Route path="/drivers/pastloads" component={DriverPastLoads} />
              <Route path="/drivers/view" component={DriverView} />

              <Route path="/trucks/trucklist" component={TruckList} />
              <Route path="/trucks/addnew" component={TruckAddNew} />

              <Route path="/trailers/trailerlist" component={TrailerList} />
              <Route path="/trailers/addnew" component={TrailerAddNew} />
              {/********************Expense Types ****************/}

              <Route path="/vendors/vendorList" component={VendorList} />
              <Route path="/vendors/vendorAddNew" component={VendorAddNew} />

              <Route path="/subCategory/list" component={ExpenseTypeList} />
              <Route path="/subCategory/addNew" component={SubCategoryAddNew} />
              <Route
                path="/category/categoryExpenseList"
                component={CategoryExpenseList}
              />
              <Route path="/category/addNew" component={CategoryAddNew} />
              <Route path="/expense/expenseList" component={ExpenseList} />
              <Route path="/expense/expenseAddNew" component={ExpenseAddNew} />
              <Route path="/expense/view" component={ExpenseView} />
              <Route path="/expense/edit" component={ExpenseEdit} />

              <Route path="/profile" component={Profile} />
              <Route path="/profile/addnew" component={ProfileAddNew} />
              <Route path="/accounting/loads" component={LoadAccounting} />
              <Route path="/accounting/edit" component={AccountingEditLoad} />
              <Route path="/accounting/drivers" component={AccountingDrivers} />
              <Route
                path="/accounting/driversPayrollEdit"
                component={AccountingDriversPayMultipleEdit}
              />
              <Route path="/reports/profitloss" component={ProfitLoss} />
              <Route path="/reports/expenses" component={ReportsExpenses} />
              <Route path="/reports/dashboard" component={ReportsHome} />

              <Route path="/settings" component={UserSettings} />
            </MainContainer>
          </Switch>
        </div>
      </div>
    </Router>
  </Provider>,
  document.getElementById('app')
)
