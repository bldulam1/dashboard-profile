import { createContext } from "react";

export const TaskContext = createContext({
  searchFileProps: {
    query: {},
    rows: [],
    selected: [],
    rootPaths: [],
    order: null,
    orderBy: null,
    page: null,
    rowsPerPage: null,
  },
  searchFileDispatch: null
});
