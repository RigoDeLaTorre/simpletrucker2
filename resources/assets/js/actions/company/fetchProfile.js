import axios from "axios";
import { FETCH_PROFILE } from "../types";

export const fetchProfile = () => dispatch => {
  axios.get("/api/fetchProfile").then(res =>
    dispatch({
      type: FETCH_PROFILE,
      payload: res.data
    })
  );
};
