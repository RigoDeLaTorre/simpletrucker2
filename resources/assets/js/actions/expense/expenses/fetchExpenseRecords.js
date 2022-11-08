import axios from "axios";
import { FETCH_EXPENSE_RECORDS } from "../../types.js";

// Pass in the Company ID  ( the users company id)
export const fetchExpenseRecords = () => dispatch => {
  axios.get("/expense/fetchExpenseRecords").then(res =>
    dispatch({
      type: FETCH_EXPENSE_RECORDS,
      payload: res.data
    })
  );
};
