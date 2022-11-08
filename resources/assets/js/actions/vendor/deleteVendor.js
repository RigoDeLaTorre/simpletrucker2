import axios from "axios";
import { DELETE_VENDOR } from "../types.js";

export const deleteVendor = (id, callback) => dispatch => {
  let message;
  axios
    .delete("/vendor/deleteVendor", { params: { id } })
    .then(res => {
      message = res.data;
      dispatch({
        type: DELETE_VENDOR,
        payload: id
      });
    })
    .then(() => callback(message));
};
