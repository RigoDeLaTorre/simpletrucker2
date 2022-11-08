import { IS_FETCHING_REQUEST, IS_FETCHING_COMPLETE } from '../actions/types.js'

const initialState = {
  isFetching: false,
  loadingText: ''
}

export default function(state = initialState, action) {
  switch (action.type) {
    case IS_FETCHING_REQUEST:
      return {
        ...state,
        isFetching: true,
        loadingText: action.payload
      }
    case IS_FETCHING_COMPLETE:
      return {
        ...state,
        isFetching: false,
        loadingText: action.payload
      }
    default:
      return state
  }
}
