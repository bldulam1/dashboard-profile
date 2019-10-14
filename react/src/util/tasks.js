export const taskReducer = (state, { type, payload }) => {
  switch (type) {
    case "UPDATE_ROWS":
      return {
        ...state,
        ...payload,
        loading: false
      };
    case "CHANGE_SORTING":
      return {
        ...state,
        forceReload: true,
        rows: [],
        sorting: payload
      };
    case "CHANGE_FILTERS":
      return {
        ...state,
        forceReload: true,
        requestedSkip: 0,
        rows: [],
        filters: payload
      };
    case "START_LOADING":
      return {
        ...state,
        requestedSkip: payload.requestedSkip,
        take: payload.take
      };
    case "REQUEST_ERROR":
      return {
        ...state,
        loading: false
      };
    case "FETCH_INIT":
      return {
        ...state,
        loading: true,
        forceReload: false
      };
    case "UPDATE_QUERY":
      return {
        ...state,
        lastQuery: payload
      };
    default:
      return state;
  }
};
