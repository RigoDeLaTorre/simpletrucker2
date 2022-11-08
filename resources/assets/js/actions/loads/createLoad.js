import axios from 'axios'
import { fetchProfile } from '../company/fetchProfile.js'
import { fetchAllLoadsDetails } from './fetchAllLoadsDetails'
import { CREATE_LOAD, FETCH_PROFILE } from '../types.js'

// Creates a new load
export const createLoad = (values, callback) => dispatch => {
  let id = null
  let invoiceId = null

  axios
    .post('/api/createLoad', { values })

    .then(res => {
      id = res.data.id
      invoiceId = res.data.invoice_id
      dispatch({
        type: CREATE_LOAD,
        payload: res.data
      })
    })
    .then(() => dispatch(fetchProfile()))
    .then(() => callback(id, invoiceId))
}
