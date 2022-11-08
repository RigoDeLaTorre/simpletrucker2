import axios from 'axios'
import { SELECT_EXPENSE_TYPE } from '../../types.js'

export const selectExpenseType = truck => dispatch => {
  dispatch({
    type: SELECT_EXPENSE_TYPE,
    payload: truck
  })
}
