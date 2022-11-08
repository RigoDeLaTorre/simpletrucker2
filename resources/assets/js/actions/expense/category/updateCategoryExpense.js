import axios from "axios";
import { UPDATE_CATEGORY_EXPENSE } from "../../types.js";

export const updateCategoryExpense = (values, callback) => dispatch => {
  axios
    .put("/category/updateCategoryExpense",  values )
    .then(res =>
      dispatch({
        type: UPDATE_CATEGORY_EXPENSE,
        payload: res.data
      })
    )
    .then(() => callback());
};
