import React, { useReducer, useEffect, useContext, Fragment } from "react";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { TestCatalogContext } from "../../context/TestCatalog.Context";
import TestCatalogData from "./components/TestCatalogData/TestCatalogData";
import { ProjectContext } from "../../context/Project.Context";
import { initializeTCProps } from "../../util/test-catalog";
import TestCatalogSearch from "./components/TestCatalogSearch/TestCatalogSearch";
import DCSchedule from "./components/DCSchedule/DCSchedule";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import uuid from "uuid/v4";

const useStyles = makeStyles(theme => ({
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    width: "98%"
  },
  tabsContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

function reducer(state, action) {
  return { ...state, ...action };
}

const _defaultProps = {
  query: {},
  dense: true,
  isLoading: true,
  cols: [],
  rows: [],
  visibleColumns: ["Record ID", "Time"],
  selected: [],
  order: "asc",
  orderBy: "Record ID",
  page: 0,
  rowsPerPage: 25,
  rowsPerPageOptions: [5, 10, 25, 50, 100, 200, 300],
  count: 0,
  features: [],
  selectedFeatures: [],
  subFeatures: [],
  selectedSubFeatures: []
};

export default props => {
  const classes = useStyles();
  const { activeProject } = useContext(ProjectContext);
  const [tcProps, tcDispatch] = useReducer(reducer, _defaultProps);
  const [selectedPanel, setSelectedPanel] = React.useState(0);

  function handleChange(event, newValue) {
    setSelectedPanel(newValue);
  }

  useEffect(() => {
    initializeTCProps({ ..._defaultProps, project: activeProject }, res =>
      tcDispatch({
        ...res,
        project: activeProject
      })
    );
  }, [activeProject]);

  return (
    <Paper className={classes.contentPaper}>
      <TestCatalogContext.Provider value={{ tcProps, tcDispatch }}>
        <Tabs
          className={classes.tabsContainer}
          indicatorColor="primary"
          value={selectedPanel}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Search" />
          <Tab label="Create Schedule" />
        </Tabs>

        {selectedPanel === 0 ? (
          <Fragment>
            <TestCatalogSearch />
            <TestCatalogData />
          </Fragment>
        ) : (
          <DCSchedule key={uuid()} />
        )}
      </TestCatalogContext.Provider>
    </Paper>
  );
};
