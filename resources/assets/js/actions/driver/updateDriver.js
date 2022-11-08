import axios from "axios";
import { UPDATE_DRIVER } from "../types.js";

export const updateDriver = (values, callback) => dispatch => {
  axios
    .put("/api/updateDriver", { values })
    .then(res =>
      dispatch({
        type: UPDATE_DRIVER,
        payload: res.data
      })
    )
    .then(() => callback());
};
