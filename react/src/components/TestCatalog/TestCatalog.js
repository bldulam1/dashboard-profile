import React, { useReducer, useEffect, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { TestCatalogContext } from "../../context/TestCatalog.Context";
import TestCatalogData from "./components/TestCatalogData/TestCatalogData";
import { ProjectContext } from "../../context/Project.Context";
import { fetchData } from "../../util/test-catalog";
import TestCatalogSearch from "./components/TestCatalogSearch/TestCatalogSearch";

const useStyles = makeStyles(theme => ({
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    width: "98%",
  }
}));

function reducer(state, action) {
  return { ...state, ...action };
}
const _defaultProps = {
  query: {},
  isLoading: true,
  cols: [],
  rows: [],
  selected: [],
  order: "asc",
  orderBy: "calories",
  page: 0,
  rowsPerPage: 10,
  count: 0
};
export default props => {
  const { activeProject } = useContext(ProjectContext);
  const [tcProps, tcDispatch] = useReducer(reducer, _defaultProps);

  useEffect(() => {
    fetchData({ ..._defaultProps, project: activeProject }, res =>
      tcDispatch({ ...res, project: activeProject })
    );
  }, [activeProject]);

  const classes = useStyles();

  return (
    <Paper className={classes.contentPaper}>
      <TestCatalogContext.Provider value={{ tcProps, tcDispatch }}>
        <TestCatalogSearch />
        <TestCatalogData />
      </TestCatalogContext.Provider>
    </Paper>
  );
};
