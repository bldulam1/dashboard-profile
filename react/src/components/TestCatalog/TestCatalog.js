import React, { useReducer, useEffect, useContext } from "react";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { TestCatalogContext } from "../../context/TestCatalog.Context";
import TestCatalogData from "./components/TestCatalogData/TestCatalogData";
import { ProjectContext } from "../../context/Project.Context";
import { initializeTCProps } from "../../util/test-catalog";
import TestCatalogSearch from "./components/TestCatalogSearch/TestCatalogSearch";
import DCSchedule from "./components/DCSchedule/DCSchedule";
import { AppBar, Tabs, Tab, Typography, Box } from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles(theme => ({
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    width: "98%"
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
  selected: [],
  order: "asc",
  orderBy: "calories",
  page: 0,
  rowsPerPage: 25,
  rowsPerPageOptions: [5, 10, 25, 50, 100, 200, 300],
  count: 0,
  features: [],
  selectedFeatures: [],
  subFeatures: [],
  selectedSubFeatures: []
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

export default props => {
  const classes = useStyles();
  const { activeProject } = useContext(ProjectContext);
  const [tcProps, tcDispatch] = useReducer(reducer, _defaultProps);
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
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
        <AppBar color="secondary" position="static">
          <Tabs
            indicatorColor="primary"
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
          >
            <Tab label="Search" {...a11yProps(0)} />
            <Tab label="Create Schedule" {...a11yProps(1)} />
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0}>
          <TestCatalogSearch />
          <TestCatalogData />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <DCSchedule />
        </TabPanel>
      </TestCatalogContext.Provider>
    </Paper>
  );
};
