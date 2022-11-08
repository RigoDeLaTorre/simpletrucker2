import axios from "axios";
import { UPDATE_EXPENSE_TYPE } from "../../types.js";

export const updateExpenseType = (values, callback) => dispatch => {
  axios
    .put("/expense/type/updateExpenseType",  values )
    .then(res =>
      dispatch({
        type: UPDATE_EXPENSE_TYPE,
        payload: res.data
      })
    )
    .then(() => callback());
};
