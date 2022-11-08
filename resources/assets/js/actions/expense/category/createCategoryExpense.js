import axios from "axios";
import { CREATE_CATEGORY_EXPENSE } from "../../types.js";

export const createCategoryExpense = (id, values, callback) => dispatch => {
  axios
    .post("/category/createCategoryExpense", { id, values })
    .then(res =>
      dispatch({
        type: CREATE_CATEGORY_EXPENSE,
        payload: res.data
      })
    )
    .then(() => callback());
};
