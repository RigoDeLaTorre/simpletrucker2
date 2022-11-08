import axios from "axios";
import { DELETE_TRUCK } from "../types.js";

export const deleteTruck = (id, callback) => dispatch => {
  let message;
  axios
    .delete("/truck/deleteTruck", { params: { id } })
    .then(res => {
      message = res.data;
      dispatch({
        type: DELETE_TRUCK,
        payload: id
      });
    })
    .then(() => callback(message));
};
