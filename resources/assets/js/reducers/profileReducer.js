import { CREATE_PROFILE, FETCH_PROFILE } from "../actions/types.js";

const initialState = {};
export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_PROFILE:
      return action.payload;
    case FETCH_PROFILE:
      return action.payload;
    default:
      return state;
  }
}
