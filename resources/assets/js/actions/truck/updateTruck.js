import axios from "axios";
import { UPDATE_TRUCK } from "../types.js";

export const updateTruck = (values, callback) => dispatch => {
  axios
    .put("/api/updateTruck",  values )
    .then(res =>
      dispatch({
        type: UPDATE_TRUCK,
        payload: res.data
      })
    )
    .then(() => callback());
};
