import axios from 'axios'
import { SELECT_CATEGORY_EXPENSE } from '../../types.js'

export const selectCategoryExpense = truck => dispatch => {
  dispatch({
    type: SELECT_CATEGORY_EXPENSE,
    payload: truck
  })
}
