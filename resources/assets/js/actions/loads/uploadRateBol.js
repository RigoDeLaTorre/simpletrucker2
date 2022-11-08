import axios from "axios";
import { UPLOAD_RATEBOL } from "../types.js";

// Creates a new load
export const uploadRateBol = (image, folder, load, invoiceId) => dispatch => {
  axios
    .post("/api/uploadRateBol", image, {
      params: {
        load,
        folder,
        invoiceId
      }
    })
    .then(res => {
      dispatch({
        type: UPLOAD_RATEBOL,
        payload: res.data
      });
    });
};
