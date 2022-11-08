import axios from 'axios'
import { SELECT_CUSTOMER } from '../types.js'

export const selectedCustomer = customer => dispatch => {
  dispatch({
    type: SELECT_CUSTOMER,
    payload: customer
  })
}
