import axios from 'axios'

import { DELETE_AWS_FILE } from '../types.js'

// Creates a new load
export const deleteAwsFile = delValues => dispatch => {
  //type is the folder it will go into.
  // "rateconfirmation" or "bol"

  axios
    .delete('/attachment/deleteAwsFile', {
      params: delValues
    })
    .then(
      res =>
        dispatch({
          type: DELETE_AWS_FILE,
          payload: res.data
        })

      //"success" or "error"
      // return res.data
    )
}
