import React, { useReducer, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Axios from "axios";
import { api_server } from "../../environment/environment";
import { DashboardContext } from "../../context/Dashboard.Context";
import DashboardStatsTable from "./Dashboard.StatsTable";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import DashboardAssignmentsTable from "./Dashboard.AssignmentsTable";
let intervalTimer = null;

const useStyles = makeStyles(theme => ({
  mainGrid: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    margin: "1rem 0.5rem"
  },
  subGrid: {
    display: "flex",
    margin: "0.5rem",
    padding: "1rem",
    flexDirection: "column",
    flexGrow: 1,
    flexBasis: 1
  },
  pb1: {
    marginBottom: theme.spacing(3)
  }
}));

function reducer(state, action) {
  return { ...state, ...action };
}
export default props => {
  const [dashboard, dashboardDispatch] = useReducer(reducer, {
    refreshRate: 1000,
    servers: [],
    serverTypes: [],
    selectedTab: 1
  });
  const { servers, refreshRate, selectedTab } = dashboard;
  const classes = useStyles();

  useEffect(() => {
    Axios.get(`${api_server}/service-workers/stats-on/current-only`).then(
      results => {
        dashboardDispatch({ servers: results.data });
        console.log(results.data);

        Axios.get(`${api_server}/server-assignments/all`)
          .then(results => {
            dashboardDispatch({ serverTypes: results.data });
          })
          .catch(error => console.log(error));
      }
    );
  }, []);

  function handleChange(event, newValue) {
    dashboardDispatch({ selectedTab: newValue });
    if (newValue === 0) {
      intervalTimer = setInterval(() => {
        Axios.get(`${api_server}/service-workers/stats-on/current-only`).then(
          results => {
            dashboardDispatch({ servers: results.data });
          }
        );
      }, refreshRate);
    } else {
      clearInterval(intervalTimer);
    }
  }

  return (
    <DashboardContext.Provider value={{ dashboard, dashboardDispatch }}>
      <div className={classes.mainGrid}>
        <Paper className={classes.subGrid}>Hello</Paper>

        <Paper className={classes.subGrid}>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
            className={classes.pb1}
          >
            <Tab label="Status" />
            <Tab label="Assignments" />
          </Tabs>
          {selectedTab === 0 && <DashboardStatsTable servers={servers} />}
          {selectedTab === 1 && <DashboardAssignmentsTable servers={servers} />}
        </Paper>
      </div>
    </DashboardContext.Provider>
  );
};
