import axios from "axios";
import { CREATE_DRIVER_USER } from "../types.js";

export const createDriverUser = () => dispatch => {
  axios
    .get("/driver/adduser", {
      params: {
        name: "rigo"
      }
    })
    .then((window.location = "/driver/adduser"));
};
