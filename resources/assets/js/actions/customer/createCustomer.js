import axios from 'axios'
import { CREATE_CUSTOMER } from '../types.js'

export const createCustomer = (id, values, callback) => dispatch => {
  axios
    .post('/api/createCustomer', { id, values })
    .then(res =>
      dispatch({
        type: CREATE_CUSTOMER,
        payload: res.data
      })
    )
    .then(() => callback())
}
