import axios from 'axios'
import { UPDATE_LOAD } from '../types.js'

// Handles the active/delivered toggle on the NeedBOl modal
export const updateLoadStatus = (values, callback) => dispatch => {
  axios
    .put('/api/updateLoadStatus', values)
    .then(res =>
      dispatch({
        type: UPDATE_LOAD,
        payload: res.data
      })
    )
    .then(() => callback())
}
