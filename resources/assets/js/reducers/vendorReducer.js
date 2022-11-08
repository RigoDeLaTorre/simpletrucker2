import {
  CREATE_VENDOR,
  FETCH_VENDORS,
  SELECT_VENDOR,
  UPDATE_VENDOR,
  DELETE_VENDOR
} from "../actions/types.js";
const initialState = {
  vendors: [],
  selectedVendor: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_VENDOR:
      return { ...state, vendors: [...state.vendors, { ...action.payload }] };
    case DELETE_VENDOR:
      return {
        ...state,
        vendors: state.vendors.filter(x => x.id != action.payload)
      };
    case FETCH_VENDORS:
      return { ...state, vendors: action.payload };
    case SELECT_VENDOR:
      return { ...state, selectedVendor: action.payload };
    case UPDATE_VENDOR:
      const driver_update_id = action.payload.id;
      return {
        ...state,
        vendors: state.vendors.map(driver =>
          driver.id === driver_update_id
            ? { ...driver, ...action.payload }
            : driver
        )
      };

    default:
      return state;
  }
}
