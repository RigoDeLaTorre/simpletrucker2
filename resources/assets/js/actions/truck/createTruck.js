import axios from "axios";
import { CREATE_TRUCK } from "../types.js";

export const createTruck = (id, values, callback) => dispatch => {
  axios
    .post("/api/createTruck", { id, values })
    .then(res =>
      dispatch({
        type: CREATE_TRUCK,
        payload: res.data
      })
    )
    .then(() => callback());
};
