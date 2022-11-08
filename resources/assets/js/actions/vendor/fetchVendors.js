import axios from "axios";
import { FETCH_VENDORS } from "../types.js";

// Pass in the Company ID  ( the users company id)
export const fetchVendors = () => dispatch => {
  axios.get("/vendor/fetchVendors").then(res => {
    dispatch({
      type: FETCH_VENDORS,
      payload: res.data
    });
  });
};
