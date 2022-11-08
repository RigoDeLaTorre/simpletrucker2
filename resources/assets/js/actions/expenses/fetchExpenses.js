import axios from "axios";
import { FETCH_EXPENSES } from "../types.js";

// Pass in the Company ID  ( the users company id)
export const fetchExpenses = () => dispatch => {
  axios.get("/api/fetchExpenses").then(res =>
    console.log(res)
  );
};
