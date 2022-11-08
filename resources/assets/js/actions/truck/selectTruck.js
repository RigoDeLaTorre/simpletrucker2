import axios from 'axios'
import { SELECT_TRUCK } from '../types.js'

export const selectTruck = truck => dispatch => {
  dispatch({
    type: SELECT_TRUCK,
    payload: truck
  })
}
