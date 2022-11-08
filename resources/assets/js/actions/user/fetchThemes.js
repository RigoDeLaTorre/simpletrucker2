import axios from "axios";
import { FETCH_THEMES } from "../types.js";

export const fetchThemes = () => dispatch => {
  axios.get("/themes/fetch").then(res =>
    dispatch({
      type: FETCH_THEMES,
      payload: res.data
    })
  );
};
