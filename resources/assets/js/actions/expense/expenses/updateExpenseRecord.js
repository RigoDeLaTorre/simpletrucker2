import axios from 'axios'
import { UPDATE_EXPENSE_RECORD, FETCH_EXPENSE_RECORDS } from '../../types.js'

export const updateExpenseRecord = (values, callback) => dispatch => {
  axios
    .put('/expense/updateExpenseRecord', values)
    .then(res =>
      dispatch({
        type: FETCH_EXPENSE_RECORDS,
        payload: res.data
      })
    )
    .then(() => callback())
}
