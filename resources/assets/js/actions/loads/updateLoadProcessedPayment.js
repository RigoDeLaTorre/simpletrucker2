import axios from 'axios'
import { UPDATE_LOAD } from '../types.js'

export const updateLoadProcessedPayment = (values, callback) => dispatch => {
  axios
    .put('/api/updateLoadProcessedPayment', { values })
    .then(res =>
      dispatch({
        type: UPDATE_LOAD,
        payload: res.data
      })
    )
    .then(() => callback())
}
