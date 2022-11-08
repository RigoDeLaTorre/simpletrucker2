import axios from "axios";
import { UPDATE_CUSTOMER } from "../types.js";

export const updateCustomer = (values, callback) => dispatch => {
  axios
    .put("/api/updateCustomer", { values })
    .then(res =>
      dispatch({
        type: UPDATE_CUSTOMER,
        payload: res.data
      })
    )
    .then(() => callback());
};
