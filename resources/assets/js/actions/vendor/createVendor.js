import axios from "axios";
import { CREATE_VENDOR } from "../types.js";

export const createVendor = (id, values, callback) => dispatch => {
  axios
    .post("/vendor/createVendor", { id, values })
    .then(res =>
      dispatch({
        type: CREATE_VENDOR,
        payload: res.data
      })
    )
    .then(() => callback());
};
