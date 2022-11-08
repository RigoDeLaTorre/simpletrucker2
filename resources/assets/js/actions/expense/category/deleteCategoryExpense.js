import axios from "axios";
import { DELETE_CATEGORY_EXPENSE } from "../../types.js";

export const deleteCategoryExpense = (id, callback) => dispatch => {
  let message;
  axios
    .delete("/category/deleteCategoryExpense", { params: { id } })
    .then(res => {
      message = res.data;
      dispatch({
        type: DELETE_CATEGORY_EXPENSE,
        payload: id
      });
    })
    .then(() => callback(message));
};
