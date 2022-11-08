import axios from 'axios'
import { FETCH_CUSTOMERS_CALLBACK } from '../types.js'

export const fetchCustomersCallback = (id, callback) => dispatch => {
  axios
    .get('/api/fetchCustomers', { params: { id } })
    .then(res =>
      dispatch({
        type: FETCH_CUSTOMERS_CALLBACK,
        payload: res.data
      })
    )
    .then(() => callback())
}
