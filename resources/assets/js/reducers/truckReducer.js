import {
  CREATE_TRUCK,
  SELECT_TRUCK,
  CREATE_EXPENSE_TYPE,
  UPDATE_TRUCK,
  FETCH_TRUCKS,
  DELETE_TRUCK
} from "../actions/types.js";
const initialState = {
  trucks: [],
  selectedTruck: {},
  expenseList: [],
  selectedTruckExpenseList: {},
  expenseRecords: [],
  selectedTruckExpense: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_TRUCK:
      return { ...state, trucks: [...state.trucks, { ...action.payload }] };
    case FETCH_TRUCKS:
      return { ...state, trucks: action.payload };

    case SELECT_TRUCK:
      return { ...state, selectedTruck: action.payload };
    case DELETE_TRUCK:
      return {
        ...state,
        trucks: state.trucks.filter(x => x.id != action.payload)
      };

    case UPDATE_TRUCK:
      const truck_update_id = action.payload.id;
      return {
        ...state,
        trucks: state.trucks.map(truck =>
          truck.id === truck_update_id ? { ...truck, ...action.payload } : truck
        )
      };

    default:
      return state;
  }
}
