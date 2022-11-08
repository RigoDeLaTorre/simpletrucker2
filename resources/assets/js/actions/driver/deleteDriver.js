import axios from "axios";
import { DELETE_DRIVER } from "../types.js";

export const deleteDriver = (id, callback) => dispatch => {
  let message;
  axios
    .delete("/driver/deleteDriver", { params: { id } })
    .then(res => {
      message = res.data;
      dispatch({
        type: DELETE_DRIVER,
        payload: id
      });
    })
    .then(() => callback(message));
};
