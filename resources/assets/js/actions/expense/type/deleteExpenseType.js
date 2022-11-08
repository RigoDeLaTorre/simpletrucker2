import axios from "axios";
import { DELETE_EXPENSE_TYPE } from "../../types.js";

export const deleteExpenseType = (id, callback) => dispatch => {
  let message;
  axios
    .delete("/expense/type/deleteExpenseType", { params: { id } })
    .then(res => {
      message = res.data;
      dispatch({
        type: DELETE_EXPENSE_TYPE,
        payload: id
      });
    })
    .then(() => callback(message));
};
