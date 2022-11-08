import axios from "axios";
import { CREATE_TRAILER } from "../types.js";

export const createTrailer = (id, values, callback) => dispatch => {
  axios
    .post("/trailer/createTrailer", { id, values })
    .then(res =>
      dispatch({
        type: CREATE_TRAILER,
        payload: res.data
      })
    )
    .then(() => callback());
};
