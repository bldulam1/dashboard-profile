import { createContext } from "react";

export const TestCatalogContext = createContext({
  tcProps: {
    query: {},
    cols: [],
    rows: [],
    selected: [],
    dense: false,
    order: null,
    orderBy: null,
    page: null,
    rowsPerPage: null
  },
  tcDispatch: null
});
