// Action Types

export const Types = {
  LOAD_FILE_REQUESTED: 'inputFile/LOAD_FILE_REQUESTED',
  LOAD_FILE_SUCCEEDED: 'inputFile/LOAD_FILE_SUCCEEDED',
  LOAD_FILE_FAILED: 'inputFile/LOAD_FILE_FAILED',
}

// Action Creators

export function load(files) {
  return {
    type: Types.LOAD_FILE_REQUESTED,
    payload: files,
  }
}

// Reducer

const INITIAL_STATE = {
  loading: false,
  error: null,
  geojson: null,
  bounds: null,
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Types.LOAD_FILE_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case Types.LOAD_FILE_SUCCEEDED:
      return {
        ...state,
        loading: false,
        error: null,
        geojson: action.payload.geojson,
        bounds: action.payload.bounds,
      }
    case Types.LOAD_FILE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    default: return state
  }
}
