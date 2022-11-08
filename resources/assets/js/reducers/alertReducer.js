import {
TOGGLE_ALERT,

} from "../actions/types.js";
const initialState = {
  alert:true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_ALERT:
      return false;
    default:
      return state;
  }
}
