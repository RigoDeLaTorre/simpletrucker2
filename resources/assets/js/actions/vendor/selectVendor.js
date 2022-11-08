import axios from 'axios'
import { SELECT_VENDOR } from '../types.js'

export const selectVendor = vendor => dispatch => {
  console.log("select vendor action started")
  dispatch({
    type: SELECT_VENDOR,
    payload: vendor
  })
}
