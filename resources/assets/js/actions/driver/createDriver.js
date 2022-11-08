import axios from "axios";
import { CREATE_DRIVER } from "../types.js";

export const createDriver = (id, values, callback) => dispatch => {
  axios
    .post("/api/createDriver", { id, values })
    .then(res =>
      dispatch({
        type: CREATE_DRIVER,
        payload: res.data
      })
    )
    .then(() => callback());
};
