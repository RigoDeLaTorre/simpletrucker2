import axios from "axios";
import { CREATE_EXPENSE_TYPE } from "../../types.js";

export const createExpenseType = (id, values, callback) => dispatch => {
  axios
    .post("/expense/type/createExpenseType", { id, values })
    .then(res =>
      dispatch({
        type: CREATE_EXPENSE_TYPE,
        payload: res.data
      })
    )
    .then(() => callback());
};
