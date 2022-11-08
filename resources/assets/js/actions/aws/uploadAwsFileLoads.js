import axios from 'axios'

import { UPLOAD_AWS_FILE_LOADS } from '../types.js'

// Creates a new load
export const uploadAwsFileLoads = (file, type, callback) => dispatch => {
  //type is the folder it will go into.
  // "rateconfirmation" or "bol"
  let linkUrl

  axios
    .get('/attachment/uploadAwsFileLoads', {
      params: {
        type,
        fileName: file.name,

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
    .then(() => callback(linkUrl))
}
