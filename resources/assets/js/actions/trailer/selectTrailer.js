import axios from 'axios'
import { SELECT_TRAILER } from '../types.js'

export const selectTrailer = truck => dispatch => {
  dispatch({
    type: SELECT_TRAILER,
    payload: truck
  })
}
