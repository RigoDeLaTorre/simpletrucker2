import axios from "axios";
import { FETCH_CUSTOMERS } from "../types.js";

export const fetchCustomers = () => dispatch => {
  axios.get("/api/fetchCustomers").then(res =>
    dispatch({
      type: FETCH_CUSTOMERS,
      payload: res.data
    })
  );
};
