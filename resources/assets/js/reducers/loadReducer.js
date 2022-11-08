// ***NEED TO RE-FACTOR THIS LOGIC AND SERIALIZE THE DATA ****

import {
  CREATE_LOAD,
  DELETE_LOAD,
  SELECT_LOAD,
  FETCH_LOADS_DETAILS,
  DELETE_PICKUP,
  DELETE_DELIVERY,
  UPDATE_LOAD,
  UPLOAD_RATEBOL,
  UPDATE_LOAD_PROCESSED_PAYMENT,
  UPDATE_LOAD_STATUS,
  UPDATE_DRIVER_PAYROLL,
  DELETE_AWS_FILE_LOADS
} from '../actions/types.js'

const initialState = {
  loads: [],
  selectedLoad: {}
}

export default function(state = initialState, action) {
  switch (action.type) {
    case DELETE_AWS_FILE_LOADS:
      const delId = action.payload.id
      return {
        ...state,
        loads: state.loads.map(
          load => (load.id === delId ? { ...load, ...action.payload } : load)
        ),
        selectedLoad: { ...state.selectedLoad, ...action.payload }
      }
    case DELETE_LOAD:
      console.log('reducer', action.payload)
      return {
        ...state,
        loads: state.loads.filter(load => load.id !== action.payload.loadId)
      }
      break
    case CREATE_LOAD:
      return { ...state, loads: [...state.loads, ...action.payload] }
      break
    case SELECT_LOAD:
      return { ...state, selectedLoad: action.payload }

    case FETCH_LOADS_DETAILS:
      return { ...state, loads: action.payload }

    case UPDATE_LOAD:
      const loadId = action.payload.id
      return {
        ...state,
        loads: state.loads.map(
          load => (load.id === loadId ? { ...load, ...action.payload } : load)
        )
      }
    case UPLOAD_RATEBOL:
      const uploadId = parseInt(action.payload.id)

      return {
        ...state,
        loads: state.loads.map(
          load => (load.id === uploadId ? { ...load, ...action.payload } : load)
        )
      }

    case DELETE_PICKUP:
      const { pickup_id, pickup_load_id } = action.payload[1]
      // the pickup id is from the pickup table , id
      // the load_id is the from table loads , id
      const pickup = action.payload[0]
      // After the pickup is deleted from the database, the server returns the updated load without that pickup
      // This is now used to replace redux store state.loads with the updated info.
      return {
        ...state,
        loads: state.loads.map(
          load => (load.id === pickup_load_id ? { ...pickup } : load)
        ),
        selectedLoad: {
          ...state.selectedLoad,
          pickups: [
            ...state.selectedLoad.pickups.filter(item => item.id !== pickup_id)
          ]
        }
      }
      break
    case DELETE_DELIVERY:
      const { delivery_id, delivery_load_id } = action.payload[1]
      // the pickup id is from the pickup table , id
      // the load_id is the from table loads , id

      const delivery = action.payload[0]

      // After the pickup is deleted from the database, the server returns the updated load without that pickup
      // This is now used to replace redux store state.loads with the updated info.
      return {
        ...state,
        loads: state.loads.map(
          load => (load.id === delivery_load_id ? { ...delivery } : load)
        ),
        selectedLoad: {
          ...state.selectedLoad,
          deliveries: [
            ...state.selectedLoad.deliveries.filter(
              item => item.id !== delivery_id
            )
          ]
        }
      }
      break
    default:
      return state
  }
}
