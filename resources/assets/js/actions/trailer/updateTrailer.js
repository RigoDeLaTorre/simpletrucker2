import axios from "axios";
import { UPDATE_TRAILER } from "../types.js";

export const updateTrailer = (values, callback) => dispatch => {
  axios
    .put("/trailer/updateTrailer",  values )
    .then(res =>
      dispatch({
        type: UPDATE_TRAILER,
        payload: res.data
      })
    )
    .then(() => callback());
};
