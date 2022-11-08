import {
  FETCH_USER_SETTINGS,
  UPDATE_USER_SETTINGS,
  FETCH_THEMES
} from "../actions/types.js";
const initialState = {
  settings: {},
  themes: [{}]
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER_SETTINGS:
      return { ...state, settings: action.payload };
    case UPDATE_USER_SETTINGS:
      return { ...state, settings: action.payload };

    case FETCH_THEMES:
      return { ...state, themes: action.payload };
    default:
      return state;
  }
}
