import axios from 'axios'
import { SELECT_DRIVER } from '../types.js'

export const selectedDriver = driver => dispatch => {
  dispatch({
    type: SELECT_DRIVER,
    payload: driver
  })
}
