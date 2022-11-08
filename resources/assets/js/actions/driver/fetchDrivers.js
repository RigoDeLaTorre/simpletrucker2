import axios from "axios";
import { FETCH_DRIVERS } from "../types.js";

// Pass in the Company ID  ( the users company id)
export const fetchDrivers = () => dispatch => {
  axios.get("/api/fetchDrivers").then(res =>
    dispatch({
      type: FETCH_DRIVERS,
      payload: res.data
    })
  );
};
