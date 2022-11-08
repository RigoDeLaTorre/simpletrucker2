import {
  CREATE_TRAILER,
  SELECT_TRAILER,
  UPDATE_TRAILER,
  FETCH_TRAILERS,
  DELETE_TRAILER
} from "../actions/types.js";
const initialState = {
  trailers: [],
  selectedTrailer: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CREATE_TRAILER:
      return { ...state, trailers: [...state.trailers, { ...action.payload }] };
    case FETCH_TRAILERS:
      return { ...state, trailers: action.payload };
    case SELECT_TRAILER:
      return { ...state, selectedTrailer: action.payload };
    case DELETE_TRAILER:
      return {
        ...state,
        trailers: state.trailers.filter(x => x.id != action.payload)
      };
    case UPDATE_TRAILER:
      const trailer_update_id = action.payload.id;
      return {
        ...state,
        trailers: state.trailers.map(trailer =>
          trailer.id === trailer_update_id
            ? { ...trailer, ...action.payload }
            : trailer
        )
      };
    default:
      return state;
  }
}
