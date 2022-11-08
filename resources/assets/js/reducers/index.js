import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'

import UserReducer from './userReducer'
import ProfileReducer from './profileReducer'
import DriverReducer from './driverReducer'
import LoadReducer from './loadReducer'
import CustomerReducer from './customerReducer'
import IsFetchingReducer from './isFetchingReducer'
import Accounting from './accounting'
import TrucksReducer from './truckReducer'
import TrailerReducer from './trailerReducer'
import VendorReducer from './vendorReducer'
import ExpenseReducer from './expenseReducer'
import AlertReducer from './alertReducer'
import UserSetting from './userSettingReducer'
import CheckoutReducer from './checkoutReducer'

const rootReducer = combineReducers({
  user: UserReducer,
  settings: UserSetting,
  company: ProfileReducer,
  customers: CustomerReducer,
  drivers: DriverReducer,
  loads: LoadReducer,
  trucks: TrucksReducer,
  trailers: TrailerReducer,
  form: formReducer,
  isFetching: IsFetchingReducer,
  accounting: Accounting,
  vendors: VendorReducer,
  expense: ExpenseReducer,
  alert: AlertReducer,
  checkout: CheckoutReducer
})

export default rootReducer
