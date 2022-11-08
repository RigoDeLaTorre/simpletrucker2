import axios from "axios";
import { CREATE_EXPENSE_RECORD } from "../../types.js";

export const createExpenseRecord = (values,callback) => dispatch => {
  axios
    .post("/expense/createExpenseRecord", values)
    .then(res =>
      dispatch({
        type: CREATE_EXPENSE_RECORD,
        payload: res.data
      })
    )
    .then(() => callback());
};
