import axios from "axios";
import { FETCH_TRUCKS } from "../types.js";

// Pass in the Company ID  ( the users company id)
export const fetchTrucks = () => dispatch => {
  axios.get("/api/fetchTrucks").then(res =>
    dispatch({
      type: FETCH_TRUCKS,
      payload: res.data
    })
  );
};
