import axios from 'axios'
import { SELECT_EXPENSE_RECORD } from '../../types.js'

export const selectExpenseRecord = truck => dispatch => {
  dispatch({
    type: SELECT_EXPENSE_RECORD,
    payload: truck
  })
}
