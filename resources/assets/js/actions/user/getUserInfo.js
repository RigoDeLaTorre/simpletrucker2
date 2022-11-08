import axios from 'axios'
import { FETCH_USER } from '../types.js'

export const getUserInfo = () => dispatch => {
  axios.get('/api/getUserInfo').then(res =>
    dispatch({
      type: FETCH_USER,
      payload: res.data
    })
  )
}
