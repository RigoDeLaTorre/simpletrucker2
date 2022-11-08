import axios from "axios";
import { DELETE_CUSTOMER } from "../types.js";

export const deleteCustomer = (id, callback) => dispatch => {
  let message;
  axios
    .delete("/customer/deleteCustomer", { params: { id } })
    .then(res => {
      message = res.data;
      dispatch({
        type: DELETE_CUSTOMER,
        payload: id
      });
    })
    .then(() => callback(message));
};
