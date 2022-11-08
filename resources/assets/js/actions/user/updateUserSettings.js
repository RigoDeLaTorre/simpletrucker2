import axios from 'axios'
import { UPDATE_USER_SETTINGS } from '../types.js'

export const updateUserSettings = id => dispatch => {
  axios.put('/settings/update', { theme_option_id: id }).then(res =>
    dispatch({
      type: UPDATE_USER_SETTINGS,
      payload: res.data
    })
  )
}
