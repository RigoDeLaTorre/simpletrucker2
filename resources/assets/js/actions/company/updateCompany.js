import axios from "axios";
import { FETCH_PROFILE } from "../types";

export const updateCompany = (values, callback) => dispatch => {
  axios
    .put("/api/updateCompany", { values })
    .then(res =>
      dispatch({
        type: FETCH_PROFILE,
        payload: res.data
      })
    )
    .then(() => callback());
};
