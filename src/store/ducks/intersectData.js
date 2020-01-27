// Action Types

export const Types = {
  FETCH_INTERSECT_DATA_REQUESTED: 'intersectData/FETCH_INTERSECT_DATA_REQUESTED',
  FETCH_INTERSECT_DATA_SUCCEEDED: 'intersectData/FETCH_INTERSECT_DATA_SUCCEEDED',
  FETCH_INTERSECT_DATA_FAILED: 'intersectData/FETCH_INTERSECT_DATA_FAILED',

  EXPORT_INTERSECT_DATA_REQUESTED: 'intersectData/EXPORT_INTERSECT_DATA_REQUESTED',
  EXPORT_INTERSECT_DATA_SUCCEEDED: 'intersectData/EXPORT_INTERSECT_DATA_SUCCEEDED',
  EXPORT_INTERSECT_DATA_FAILED: 'intersectData/EXPORT_INTERSECT_DATA_FAILED',
}

// Action Creators

export function fetchIntersectData(bounds) {
  return {
    type: Types.FETCH_INTERSECT_DATA_REQUESTED,
    payload: bounds,
  }
}

export function exportIntersectData() {
  return {
    type: Types.EXPORT_INTERSECT_DATA_REQUESTED,
  }
}

// Reducer

const INITIAL_STATE = {
  loading: false,
  error: null,
  data: null,
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Types.FETCH_INTERSECT_DATA_REQUESTED:
      return {
        ...state,
        loading: true,
      }
    case Types.FETCH_INTERSECT_DATA_SUCCEEDED:
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload,
      }
    case Types.FETCH_INTERSECT_DATA_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    default: return state
  }
}
