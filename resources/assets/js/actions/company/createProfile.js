import axios from "axios";
import { CREATE_PROFILE, IS_FETCHING_REQUEST,
IS_FETCHING_COMPLETE } from "../types";

export const createProfile = (values, callback) => dispatch => {
      dispatch({type:IS_FETCHING_REQUEST})
  axios
    .post("/api/createProfile", values)
    .then(res =>
      dispatch({
        type: CREATE_PROFILE,
        payload: res.data
      })
    )
    .then(() => callback())
    .then(()=>dispatch({type:IS_FETCHING_COMPLETE}))
};
