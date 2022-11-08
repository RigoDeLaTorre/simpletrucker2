import axios from 'axios'
import { FETCH_PURCHASES } from '../types.js'

// Pass in the Company ID  ( the users company id)
export const fetchPurchases = () => dispatch => {
  axios.get('/purchases/fetchPurchases').then(res =>
    dispatch({
      type: FETCH_PURCHASES,
      payload: res.data
    })
  )
}
