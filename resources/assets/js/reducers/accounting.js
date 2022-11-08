import {
  SELECT_DRIVER_PAYROLL,
  UPDATE_DRIVER_PAYROLL,
  CLEAR_DRIVER_PAYROLL
} from '../actions/types.js'

const initialState = {
  loadSelected: []
}

export default function(state = initialState, action) {
  switch (action.type) {
    case SELECT_DRIVER_PAYROLL:
      let index = state.loadSelected.findIndex(el => el.id == action.payload.id)
      if (index == -1)
        return {
          ...state,
          loadSelected: [...state.loadSelected, { ...action.payload }]
        }
      if (index != -1)
        return {
          ...state,
          loadSelected: state.loadSelected.filter(
            load => load.id != action.payload.id
          )
        }

      return state
    // case UPDATE_DRIVER_PAYROLL:
    //   return initialState;
    case CLEAR_DRIVER_PAYROLL:
      return initialState
    default:
      return state
  }
}
