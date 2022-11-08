import { FETCH_USER } from '../actions/types.js'

const initialState = {}

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCH_USER:
      return action.payload.user
    default:
      return state
  }
}
