import axios from "axios";
import { DELETE_EXPENSE_RECORD } from "../../types.js";

export const deleteExpenseRecord = (id, callback) => dispatch => {
  let message;
  axios
    .delete("/expense/deleteExpenseRecord", { params: { id } })
    .then(res => {
      message = res.data;
      dispatch({
        type: DELETE_EXPENSE_RECORD,
        payload: id
      });
    })
    .then(() => callback(message));
};
