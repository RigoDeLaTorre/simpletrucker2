import axios from 'axios'
import { FETCH_CATEGORY_EXPENSES } from '../../types.js'

// Pass in the Company ID  ( the users company id)
export const fetchCategoryExpenses = () => dispatch => {
  axios.get('/category/fetchCategoryExpenses').then(res =>
    dispatch({
      type: FETCH_CATEGORY_EXPENSES,
      payload: res.data
    })
  )
}
