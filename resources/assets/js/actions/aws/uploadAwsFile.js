import axios from 'axios'

import { UPLOAD_AWS_FILE } from '../types.js'

// Creates a new load
export const uploadAwsFile = (file, type, fieldName, callback) => dispatch => {
  //type is the folder it will go into.
  // "rateconfirmation" or "bol"
  let linkUrl
  console.log('aws action hit', fieldName)
  axios
    .get('/attachment/uploadAwsFile', {
      params: {
        type,
        fileName: file.name,
        fieldName: fieldName
      }
    })
    .then(res => {
      linkUrl = res.data.key
      axios.put(res.data.uploadLink, file, {
        headers: {
          'Content-Type': file.type
        }
      })
    })
    .then(() => callback())
}
