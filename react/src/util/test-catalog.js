import Axios from "axios";
import { api_server } from "../environment/environment";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

export function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

function createCol(id, numeric, disablePadding, label) {
  return { id, numeric, disablePadding, label };
}

function fetchColumns(rows, mainColumn) {
  const unwanted_keys = [
    "_id",
    "__v",
    "project",
    "sheetName",
    "Serie",
    "Pattern"
  ];
  const ids = rows.reduce((ids, row) => {
    const keys = Object.keys(row).filter(key => !unwanted_keys.includes(key));
    const cols = keys.map(key =>
      createCol(key, !isNaN(row[key]), key === mainColumn, key)
    );
    return { ...ids, ...{ ...cols } };
  }, {});
  return Object.values(ids);
}

export function fetchData({ project, page, rowsPerPage, query }, callback) {
  const qs = JSON.stringify(query);
  const url = `${api_server}/tc/${project}/${page}/${rowsPerPage}/${qs}`;
  Axios.get(url).then(res => {
    const { rows, count } = res.data;

    // const nRows = rows.map(row =>
    //   Object.keys(row).reduce((nRow, key) => ({ ...nRow, [key]: row[key] }), {})
    // );

    callback({
      rows,
      count,
      cols: fetchColumns(rows, "Record ID"),
      isLoading: false
    });
  });
}
