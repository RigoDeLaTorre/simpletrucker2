import {
  CREATE_DRIVER,
  FETCH_DRIVERS,
  SELECT_DRIVER,
  SORTBY_DRIVER,
  UPDATE_DRIVER,
  DELETE_DRIVER
} from "../actions/types.js";
const initialState = {
  drivers: [],
  selectedDriver: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_DRIVER:
      return { ...state, drivers: [...state.drivers, { ...action.payload }] };
    case FETCH_DRIVERS:
      return { ...state, drivers: action.payload };
    case SELECT_DRIVER:
      return { ...state, selectedDriver: action.payload };
    case DELETE_DRIVER:
      return {
        ...state,
        drivers: state.drivers.filter(x => x.id != action.payload)
      };
    case UPDATE_DRIVER:
      const driver_update_id = action.payload.id;
      return {
        ...state,
        drivers: state.drivers.map(driver =>
          driver.id === driver_update_id
            ? { ...driver, ...action.payload }
            : driver
        )
      };
    case SORTBY_DRIVER:
      return { ...state, drivers: action.payload };
    default:
      return state;
  }
}
