import axios from 'axios'
import { FETCH_USER_SETTINGS } from '../types.js'

export const fetchUserSettings = () => dispatch => {
  axios.get('/settings/fetch').then(res =>
    dispatch({
      type: FETCH_USER_SETTINGS,
      payload: res.data
    })
  )
}
