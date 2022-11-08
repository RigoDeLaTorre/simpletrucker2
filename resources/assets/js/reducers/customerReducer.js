import {
  CREATE_CUSTOMER,
  FETCH_CUSTOMERS,
  FETCH_CUSTOMERS_CALLBACK,
  SELECT_CUSTOMER,
  SORTBY_CUSTOMER,
  UPDATE_CUSTOMER,
  IS_FETCHING_REQUEST,
  IS_FETCHING_COMPLETE,
  DELETE_CUSTOMER
} from "../actions/types.js";

const initialState = {
  customers: [],
  selectedCustomer: {},
  isFetching: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case IS_FETCHING_REQUEST:
      return { ...state, isFetching: true };
    case IS_FETCHING_COMPLETE:
      return { ...state, isFetching: false };
    case CREATE_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, { ...action.payload }]
      };
    case DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(x => x.id != action.payload)
      };
    case FETCH_CUSTOMERS:
      return { ...state, customers: action.payload };
    case FETCH_CUSTOMERS_CALLBACK:
      return { ...state, customers: action.payload };
    case SELECT_CUSTOMER:
      return { ...state, selectedCustomer: action.payload };
    case UPDATE_CUSTOMER:
      const customer_update_id = action.payload.id;
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === customer_update_id
            ? { ...customer, ...action.payload }
            : customer
        )
      };
    case SORTBY_CUSTOMER:
      return { ...state, customers: action.payload };
    default:
      return state;
  }
}
