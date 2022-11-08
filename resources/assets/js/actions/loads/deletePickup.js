import axios from "axios";
import { DELETE_PICKUP } from "../types.js";

// Deletes a pickup from a load, the pickup id from the delivery table is passed in
export const deletePickup = (pickupItem, callback) => dispatch => {
  axios
    .delete("/api/deletePickup", { params: { pickupItem } })
    .then(res =>
      dispatch({
        type: DELETE_PICKUP,
        payload: res.data
      })
    )
    .then(() => callback());
};
