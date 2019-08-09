import React from "react";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { TestCatalogContext } from "../../context/TestCatalog.Context";
import SimpleSearch from "./components/TestCatalogSearch/SimpleSearch";
import TestCatalogData from "./components/TestCatalogData/TestCatalogData";
import { ProjectContext } from "../../context/Project.Context";

const useStyles = makeStyles(theme => ({
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    width: "100%"
  }
}));

function reducer(state, action) {
  return { ...state, ...action };
}

function createRow(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

function createCol(id, numeric, disablePadding, label) {
  return { id, numeric, disablePadding, label };
}

const data = [
  createRow("Cupcake", 305, 3.7, 67, 4.3),
  createRow("Donut", 452, 25.0, 51, 4.9),
  createRow("Eclair", 262, 16.0, 24, 6.0),
  createRow("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createRow("Gingerbread", 356, 16.0, 49, 3.9),
  createRow("Honeycomb", 408, 3.2, 87, 6.5),
  createRow("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createRow("Jelly Bean", 375, 0.0, 94, 0.0),
  createRow("KitKat", 518, 26.0, 65, 7.0),
  createRow("Lollipop", 392, 0.2, 98, 0.0),
  createRow("Marshmallow", 318, 0, 81, 2.0),
  createRow("Nougat", 360, 19.0, 9, 37.0),
  createRow("Oreo", 437, 18.0, 63, 4.0)
];

function fetchColumns(rows, mainColumn) {
  const ids = rows.reduce((ids, row) => {
    const keys = Object.keys(row);
    const cols = keys.map(key =>
      createCol(key, !isNaN(row[key]), key === mainColumn, key)
    );
    return { ...ids, ...{ ...cols } };
  }, {});
  return Object.values(ids);
}

export default props => {
  const classes = useStyles();
  // const { activeProject } = React.useContext(ProjectContext);
  const _defaultProps = {
    cols: fetchColumns(data, "name"),
    rows: data,
    selected: [],
    order: "asc",
    orderBy: "calories",
    page: 0,
    rowsPerPage: 10
  };

  const [tcProps, tcDispatch] = React.useReducer(reducer, _defaultProps);

  return (
    <Paper className={classes.contentPaper}>
      <TestCatalogContext.Provider value={{ tcProps, tcDispatch }}>
        <SimpleSearch />
        <TestCatalogData />
      </TestCatalogContext.Provider>
    </Paper>
  );
};
