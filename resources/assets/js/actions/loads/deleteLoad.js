import axios from "axios";
import { DELETE_LOAD } from "../types.js";

// This handles updates via the accounting modals, as well as edits made to the load.

export const deleteLoad = (values, callback) => dispatch => {
  let responseData;
  axios
    .put("/api/deleteLoad", { values })
    .then(res => {
      responseData = res.data;
      dispatch({
        type: DELETE_LOAD,
        payload: res.data
      });
    })
    .then(() => callback(responseData));
};
