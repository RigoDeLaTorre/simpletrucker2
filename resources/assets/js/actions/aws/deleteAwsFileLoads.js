import axios from 'axios'

import { DELETE_AWS_FILE_LOADS } from '../types.js'

// Creates a new load
export const deleteAwsFileLoads = delValues => dispatch => {
  //type is the folder it will go into.
  // "rateconfirmation" or "bol"

  axios
    .delete('/attachment/deleteAwsFileLoads', {
      params: delValues
    })
    .then(
      res =>
        dispatch({
          type: DELETE_AWS_FILE_LOADS,
          payload: res.data
        })

      //"success" or "error"
      // return res.data
    )
}
