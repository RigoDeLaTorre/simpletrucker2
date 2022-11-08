import axios from "axios";
import { FETCH_EXPENSE_TYPES } from "../../types.js";

// Pass in the Company ID  ( the users company id)
//Controller =CategoryExpenseTypes

export const fetchExpenseTypes = () => dispatch => {
  axios.get("/expense/type/fetchExpenseTypes").then(res =>
    dispatch({
      type: FETCH_EXPENSE_TYPES,
      payload: res.data
    })
  );
};
