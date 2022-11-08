import axios from 'axios'
import { fetchProfile } from '../company/fetchProfile.js'
import { FETCH_PROFILE, CREATE_PURCHASE } from '../types'
// Deletes a delivery from a load, the delivery id from the delivery table is passed in
export const handleToken30 = (token, callback) => dispatch => {
  axios.post('/api/stripe30', token).then(res => {
    if (res.data.error) {
      callback(res.data)
    } else if (res.data.success) {
      //display toast, successful, add credit to screen
      callback(res.data)
      dispatch(fetchProfile())
      dispatch({
        type: CREATE_PURCHASE,
        payload: res.data.data
      })
    }
  })
}

// import axios from "axios";
//
// import { FETCH_PROFILE } from "../types";
// // Deletes a delivery from a load, the delivery id from the delivery table is passed in
//
// let fetchProfile = () => dispatch => {
//   axios.get("/api/fetchProfile").then(res =>
//     dispatch({
//       type: FETCH_PROFILE,
//       payload: res.data
//     })
//   );
// };
//
// export const handleToken = token => dispatch => {
//   axios.post("/api/stripe", token).then(res => {
//     console.log(res);
//     if (res.data == "error") {
//       //if response is charge error
//       //dispatch a credit error on the screen
//       console.log("Charge did not go through, please try again");
//     } else if (res.data == "success") {
//       //display toast, successful, add credit to screen
//       console.log("Succesfully Added 5 credits");
//       dispatch(fetchProfile());
//       console.log("fetching profile");
//     }
//   });
// };
