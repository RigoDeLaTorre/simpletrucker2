import axios from "axios";
import { DELETE_TRAILER } from "../types.js";

export const deleteTrailer = (id, callback) => dispatch => {
  let message;
  axios
    .delete("/trailer/deleteTrailer", { params: { id } })
    .then(res => {
      message = res.data;
      dispatch({
        type: DELETE_TRAILER,
        payload: id
      });
    })
    .then(() => callback(message));
};
