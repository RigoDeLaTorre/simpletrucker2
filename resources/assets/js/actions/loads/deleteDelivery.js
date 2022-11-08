import axios from "axios";
import { DELETE_DELIVERY } from "../types.js";

// Deletes a delivery from a load, the delivery id from the delivery table is passed in
export const deleteDelivery = (deliveryItem, callback) => dispatch => {
  axios
    .delete("/api/deleteDelivery", { params: { deliveryItem } })
    .then(res =>
      dispatch({
        type: DELETE_DELIVERY,
        payload: res.data
      })
    )
    .then(() => callback());
};
