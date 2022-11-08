import {
  FETCH_PURCHASES,
  CREATE_PURCHASE,
  SELECT_PURCHASE
} from '../actions/types.js'
const initialState = {
  purchases: [],
  selectedPurchase: {}
}

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_PURCHASE:
      return {
        ...state,
        purchases: [action.payload, ...state.purchases]
      }
    case FETCH_PURCHASES:
      return { ...state, purchases: action.payload }
    case SELECT_PURCHASE:
      return { ...state, selectedPurchase: action.payload }
    default:
      return state
  }
}
