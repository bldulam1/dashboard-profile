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
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    width: "100%"
  }
}));

function reducer(state, action) {
  return { ...state, ...action };
}
export default props => {
  const [dashboard, dashboardDispatch] = useReducer(reducer, {
    refreshRate: 1000,
    servers: [],
    selectedTab: 1
  });
  const { servers, refreshRate, selectedTab } = dashboard;
  const classes = useStyles();

  useEffect(() => {
    Axios.get(`${api_server}/service-workers/stats-on/current-only`).then(
      results => {
        dashboardDispatch({ servers: results.data });
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
    <Paper className={classes.contentPaper}>
      <DashboardContext.Provider value={{ dashboard, dashboardDispatch }}>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Server Status" />
          <Tab label="Server Assignments" />
        </Tabs>
        {selectedTab === 0 && <DashboardStatsTable servers={servers} />}
        {selectedTab === 1 && <DashboardAssignmentsTable servers={servers} />}
      </DashboardContext.Provider>
    </Paper>
  );
};
