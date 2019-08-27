import React, { useEffect, useReducer } from "react";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Axios from "axios";
import { api_server } from "../environment/environment";
import { Typography } from "@material-ui/core";
import { DashboardContext } from "../context/Dashboard.Context";

const useStyles = makeStyles(theme => ({
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    width: "100%"
  }
}));

// async function fetchWorkerStatus() {
//   const { data } = await Axios.get(
//     `${api_server}/service-workers/stats-on/all`
//   );
//   return { ...data };
// }

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
      Axios.get(`${api_server}/service-workers/stats-on/all`).then(results => {
        dashboardDispatch({ servers: results.data });
      });
    }, refreshRate);
    return () => clearInterval(id);
  });

  return (
    <Paper className={classes.contentPaper}>
      <DashboardContext.Provider value={{ dashboard, dashboardDispatch }}>
        <div>
          <Typography>Server Status</Typography>
          {servers.map(({ _id, serverName, mem, cpu }) => (
            <div key={_id}>
              <Typography>{serverName}</Typography>
              <Typography>{`Memory ${(100 * mem[mem.length - 1].free) /
                mem[mem.length - 1].total} %`}</Typography>
              <Typography>{`CPU ${cpu.reduce(
                (acc, c) => acc + c.currentload,
                0
              ) / cpu.length} %`}</Typography>
            </div>
          ))}
        </div>
      </DashboardContext.Provider>
    </Paper>
  );
};
