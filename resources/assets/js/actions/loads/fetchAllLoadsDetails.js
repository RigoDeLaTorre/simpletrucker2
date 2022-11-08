import axios from 'axios'
import { FETCH_LOADS_DETAILS } from '../types.js'

// Fetches all loads with their customer, driver, pickups, and deliveries

export const fetchAllLoadsDetails = callback => dispatch => {
  axios
    .get('/api/fetchAllLoadsDetails')
    .then(res =>
      dispatch({
        type: FETCH_LOADS_DETAILS,
        payload: res.data
      })
    )
    .then(() => callback())
}
