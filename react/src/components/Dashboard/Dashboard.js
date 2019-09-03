import React, { useEffect, useReducer } from "react";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Axios from "axios";
import { api_server } from "../../environment/environment";
import { DashboardContext } from "../../context/Dashboard.Context";
import DashboardStatsTable from "./Dashboard.StatsTable";

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
    servers: []
  });
  const { servers, refreshRate } = dashboard;
  const classes = useStyles();

  useEffect(() => {
    let id = setInterval(() => {
      Axios.get(`${api_server}/service-workers/stats-on/current-only`).then(results => {
        console.log(results.data);
        dashboardDispatch({ servers: results.data });
      });
    }, refreshRate);
    return () => clearInterval(id);
  });

  return (
    <Paper className={classes.contentPaper}>
      <DashboardContext.Provider value={{ dashboard, dashboardDispatch }}>
        <DashboardStatsTable servers={servers} />
      </DashboardContext.Provider>
    </Paper>
  );
};
