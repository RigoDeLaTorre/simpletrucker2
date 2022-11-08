import axios from 'axios'
import { CREATE_EXPENSE_RECORD_AWS } from '../../types.js'

export const createExpenseRecordAws = (values, callback) => dispatch => {
  let callBackData
  axios
    .post('/expense/createExpenseRecord', values)
    .then(res => {
      callBackData = { ...res.data }
      callback({ fieldName: 'expense_id', id: callBackData.id })
    
    })

}
