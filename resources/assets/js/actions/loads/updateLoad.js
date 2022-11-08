import axios from 'axios'
import { UPDATE_LOAD } from '../types.js'

// This handles updates via the accounting modals, as well as edits made to the load.

export const updateLoad = (values, callback) => dispatch => {
  axios
    .put('/api/updateLoad', { values })
    .then(res =>
      dispatch({
        type: UPDATE_LOAD,
        payload: res.data
      })
    )
    .then(() => callback())
}
