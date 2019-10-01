import { createContext } from "react";

export const TestCatalogContext = createContext({
  tcProps: {
    query: {},
    cols: [],
    rows: [],
    visibleColumns: [],
    selected: [],
    dense: true,
    order: null,
    orderBy: null,
    page: null,
    rowsPerPage: null,
    count: 0,
    features: [],
    selectedFeatures: [],
    subFeatures: [],
    selectedSubFeatures: []
  },
  tcDispatch: null
});
