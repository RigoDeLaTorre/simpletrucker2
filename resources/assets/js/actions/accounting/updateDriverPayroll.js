import axios from 'axios'
import { UPDATE_DRIVER_PAYROLL } from '../types.js'

// Handles the active/delivered toggle on the NeedBOl modal
export const updateDriverPayroll = (values, callback) => dispatch => {
let resData = null
  axios
    .put('/api/updateDriverPayroll', {
      params:values
    })
    .then(res =>{
      resData=res.data;
      dispatch({
        type: UPDATE_DRIVER_PAYROLL,
        payload: res.data
      })
    }
  ).then((res) => callback(resData))
}
