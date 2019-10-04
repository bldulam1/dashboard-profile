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

async function fetchColumns(rows, mainColumn, project) {
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
      createCol(key, !isNaN(row[key]), key === mainColumn)
    );
    return { ...ids, ...{ ...cols } };
  }, {});
  const summary = Object.values(ids);
  const summaryIDs = summary.map(s => s.id);
  const url = `${api_server}/tc/${project}/test-catalog-codes/${JSON.stringify(
    summaryIDs
  )}`;
  const results = await Axios.get(url);
  const { values } = results.data;
  return summary.map((s, sIndex) => ({ ...s, label: values[sIndex] }));
}

export function fetchData({ project, page, rowsPerPage, query }, callback) {
  const qs = JSON.stringify(query);
  const url = `${api_server}/tc/${project}/${page}/${rowsPerPage}/${qs}`;
  Axios.get(url).then(async res => {
    const { rows, count, subFeatures, subFeaturesMeaning } = res.data;
    // console.log(res.data);
    const cols = await fetchColumns(rows, "Record ID", project);
    callback({
      rows,
      count,
      subFeatures,
      subFeaturesMeaning,
      cols,
      isLoading: false
    });
  });
}

export function initializeTCProps(
  { project, page, rowsPerPage, query },
  callback
) {
  const sheetsAPI = `${api_server}/tc/${project}/unique/sheetName`;
  const qs = JSON.stringify(query);
  const dataAPI = `${api_server}/tc/${project}/${page}/${rowsPerPage}/${qs}`;
  Promise.all([Axios.get(sheetsAPI), Axios.get(dataAPI)]).then(async values => {
    const { features, featuresMeaning } = values[0].data;
    const { rows, count, subFeatures, subFeaturesMeaning } = values[1].data;

    const cols = await fetchColumns(rows, "Record ID", project);

    callback({
      features,
      featuresMeaning,
      subFeatures,
      subFeaturesMeaning,
      rows,
      count,
      cols,
      isLoading: false
    });
  });
}
