import React, { useReducer, useState, useEffect, useMemo } from "react";
import {
  VirtualTableState,
  DataTypeProvider,
  FilteringState,
  SortingState,
  createRowCache
} from "@devexpress/dx-react-grid";
import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  TableFilterRow
} from "@devexpress/dx-react-grid-material-ui";
import { api_server } from "../../../environment/environment";
import Axios from "axios";
import { taskReducer } from "../../../util/tasks";
import { AutoSizer } from "react-virtualized";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import ScheduleIcon from "@material-ui/icons/Schedule";
import CircularProgress from "@material-ui/core/CircularProgress";

const VIRTUAL_PAGE_SIZE = 100;
const MAX_ROWS = 100;
const getRowId = row => row._id;

const CurrencyFormatter = ({ value }) => (
  <b style={{ color: "darkblue" }}>${value}</b>
);

const CurrencyTypeProvider = props => (
  <DataTypeProvider formatterComponent={CurrencyFormatter} {...props} />
);

const DateTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={({ value }) =>
      value.replace(/(\d{4})-(\d{2})-(\d{2})(T.*)/, "$3.$2.$1")
    }
    {...props}
  />
);

const StatusTypeProvider = props => (
  <DataTypeProvider
    formatterComponent={({ value }) => {
      switch (value) {
        case "Completed":
          return <CheckCircleIcon color="primary" />;
        case "In Progress":
          return <CircularProgress size={20} color="secondary" />;
        case "Pending":
          return <ScheduleIcon color="default" />;
        default:
          return <ErrorIcon color="default" />;
      }
    }}
    {...props}
  />
);

const initialState = project => ({
  rows: [],
  skip: 0,
  requestedSkip: 0,
  take: VIRTUAL_PAGE_SIZE * 2,
  totalCount: 0,
  loading: false,
  lastQuery: JSON.stringify({ query: { project }, sort: { requestDate: -1 } }),
  sorting: [],
  filters: [],
  forceReload: false
});

export default params => {
  const { project } = params;

  const [state, dispatch] = useReducer(taskReducer, initialState(project));
  const [columns] = useState([
    {
      name: "inputFile",
      title: "Input File",
      getCellValue: row => row.inputFile
    },
    {
      name: "operation",
      title: "Operation",
      getCellValue: row => row.operation
    },
    {
      name: "requestedBy",
      title: "Requester",
      getCellValue: row => row.requestedBy
    },
    {
      name: "requestDate",
      title: "Request Date",
      getCellValue: row => row.requestDate
    },
    {
      name: "assignedWorker",
      title: "Server",
      getCellValue: row => row.assignedWorker
    },
    {
      name: "status.text",
      title: "Status",
      getCellValue: row => row.status.text
    }
  ]);
  const [tableColumnExtensions] = useState([
    { columnName: "requestedBy", width: 150 },
    { columnName: "operation", width: 100 },
    { columnName: "requestDate", width: 220 },
    { columnName: "assignedWorker", width: 150 },
    { columnName: "status.text", width: 110 }
  ]);

  const cache = useMemo(() => createRowCache(VIRTUAL_PAGE_SIZE), []);
  const updateRows = (skip, count, newTotalCount) => {
    dispatch({
      type: "UPDATE_ROWS",
      payload: {
        skip,
        rows: cache.getRows(skip, count),
        totalCount: newTotalCount < MAX_ROWS ? newTotalCount : MAX_ROWS
      }
    });
  };

  const getRemoteRows = (requestedSkip, take) => {
    dispatch({ type: "START_LOADING", payload: { requestedSkip, take } });
  };

  const buildQueryString = () => {
    const { filters, sorting } = state;

    const sort = sorting.reduce(
      (acc, { columnName, direction }) => ({
        ...acc,
        [columnName]: direction === "asc" ? 1 : -1
      }),
      {}
    );

    const query = filters.reduce(
      (acc, { columnName, value }) => ({
        [columnName]: { $regex: value, $options: "ig" },
        ...acc
      }),
      { }
    );

    return JSON.stringify({ sort, query });
  };

  const loadData = () => {
    const { requestedSkip, take, lastQuery, loading, forceReload } = state;
    const queryString = buildQueryString();
    if ((queryString !== lastQuery || forceReload) && !loading) {
      if (forceReload) {
        cache.invalidate();
      }
      const cached = cache.getRows(requestedSkip, take);
      if (cached.length === take) {
        updateRows(requestedSkip, take);
      } else {
        dispatch({ type: "FETCH_INIT" });

        Axios.get(`${api_server}/tasks/${project}`, {
          params: {
            skip: requestedSkip,
            limit: take,
            queryString
          }
        })
          .then(results => {
            const { count, limit, skip, tasks } = results.data;
            cache.setRows(requestedSkip, tasks);
            updateRows(skip, limit, count);
          })
          .catch(() => dispatch({ type: "REQUEST_ERROR" }));
      }
      dispatch({ type: "UPDATE_QUERY", payload: queryString });
    }
  };

  const changeFilters = value => {
    dispatch({ type: "CHANGE_FILTERS", payload: value });
  };

  const changeSorting = value => {
    dispatch({ type: "CHANGE_SORTING", payload: value });
  };

  useEffect(() => loadData());

  const { rows, skip, totalCount, loading, sorting, filters } = state;
  return (
    <AutoSizer
      style={{ backgroundColor: "coral", color: "rgba(255,255,255,0.9)" }}
    >
      {({ width, height }) => (
        <div style={{ width, height }}>
          <Grid rows={rows} columns={columns} getRowId={getRowId}>
            <CurrencyTypeProvider for={["SalesAmount"]} />
            <DateTypeProvider for={["requestDate"]} />
            <StatusTypeProvider for={["status.text"]} />
            <VirtualTableState
              loading={loading}
              totalRowCount={totalCount}
              pageSize={VIRTUAL_PAGE_SIZE}
              skip={skip}
              getRows={getRemoteRows}
            />
            <SortingState sorting={sorting} onSortingChange={changeSorting} />
            <FilteringState filters={filters} onFiltersChange={changeFilters} />
            <VirtualTable
              columnExtensions={tableColumnExtensions}
              height={height}
              width={width}
            />
            <TableHeaderRow showSortingControls />
            <TableFilterRow />
          </Grid>
        </div>
      )}
    </AutoSizer>
  );
};
