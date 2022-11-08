import {
  CREATE_CATEGORY_EXPENSE,
  FETCH_CATEGORY_EXPENSES,
  UPDATE_CATEGORY_EXPENSE,
  SELECT_CATEGORY_EXPENSE,
  DELETE_CATEGORY_EXPENSE,
  CREATE_EXPENSE_TYPE,
  SELECT_EXPENSE_TYPE,
  FETCH_EXPENSE_TYPES,
  UPDATE_EXPENSE_TYPE,
  DELETE_EXPENSE_TYPE,
  CREATE_EXPENSE_RECORD,
  UPDATE_EXPENSE_RECORD,
  FETCH_EXPENSE_RECORDS,
  SELECT_EXPENSE_RECORD,
  DELETE_EXPENSE_RECORD
} from "../actions/types.js";

const initialState = {
  categories: [],
  selectedCategory: {},
  expenseTypes: [],
  selectedExpenseType: {},
  expenseRecords: [],
  selectedExpenseRecord: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_CATEGORY_EXPENSE:
      return {
        ...state,
        categories: [...state.categories, { ...action.payload }]
      };
    case FETCH_CATEGORY_EXPENSES:
      return { ...state, categories: action.payload };
    case SELECT_CATEGORY_EXPENSE:
      return { ...state, selectedCategory: action.payload };
    case DELETE_CATEGORY_EXPENSE:
      return {
        ...state,
        categories: state.categories.filter(x => x.id != action.payload)
      };
    case UPDATE_CATEGORY_EXPENSE:
      const category_update_id = action.payload.id;
      return {
        ...state,
        categories: state.categories.map(driver =>
          driver.id === category_update_id
            ? { ...driver, ...action.payload }
            : driver
        )
      };
    case CREATE_EXPENSE_TYPE:
      return {
        ...state,
        expenseTypes: [...state.expenseTypes, action.payload]
      };
    case SELECT_EXPENSE_TYPE:
      return { ...state, selectedExpenseType: action.payload };
    case FETCH_EXPENSE_TYPES:
      return { ...state, expenseTypes: action.payload };
    case DELETE_EXPENSE_TYPE:
      return {
        ...state,
        expenseTypes: state.expenseTypes.filter(x => x.id != action.payload)
      };
    case UPDATE_EXPENSE_TYPE:
      const expenseTypes_update_id = action.payload.id;
      return {
        ...state,
        expenseTypes: state.expenseTypes.map(expense =>
          expense.id === expenseTypes_update_id
            ? { ...expense, ...action.payload }
            : expense
        )
      };

    case CREATE_EXPENSE_RECORD:
      return {
        ...state,
        expenseRecords: [...state.expenseRecords, { ...action.payload }]
      };
    case FETCH_EXPENSE_RECORDS:
      return { ...state, expenseRecords: action.payload };
    case DELETE_EXPENSE_RECORD:
      return {
        ...state,
        expenseRecords: state.expenseRecords.filter(x => x.id != action.payload)
      };
    case UPDATE_EXPENSE_RECORD:
      const truck_expense_record_update_id = action.payload.id;
      return {
        ...state,
        expenseRecords: state.expenseRecords.map(expense =>
          expense.id === truck_expense_record_update_id
            ? { ...expense, ...action.payload }
            : expense
        )
      };

    case SELECT_EXPENSE_RECORD:
      return { ...state, selectedExpenseRecord: action.payload };

    default:
      return state;
  }
}
