import axios from "axios";
import { UPDATE_VENDOR } from "../types.js";

export const updateVendor = (values, callback) => dispatch => {
  axios
    .put("/vendor/updateVendor", { values })
    .then(res =>
      dispatch({
        type: UPDATE_VENDOR,
        payload: res.data
      })
    )
    .then(() => callback());
};
