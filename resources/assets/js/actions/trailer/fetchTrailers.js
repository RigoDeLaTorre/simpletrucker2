import axios from "axios";
import { FETCH_TRAILERS } from "../types.js";

// Pass in the Company ID  ( the users company id)
export const fetchTrailers = () => dispatch => {
  axios.get("/trailer/fetchTrailers").then(res =>
    dispatch({
      type: FETCH_TRAILERS,
      payload: res.data
    })
  );
};
