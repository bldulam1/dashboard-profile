import React, { useEffect, useReducer } from "react";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Axios from "axios";
import { api_server } from "../../environment/environment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { DashboardContext } from "../../context/Dashboard.Context";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Tooltip } from "@material-ui/core";

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
      Axios.get(`${api_server}/service-workers/stats-on/all`).then(results => {
        // console.log(results.data);
        dashboardDispatch({ servers: results.data });
      });
    }, refreshRate);
    return () => clearInterval(id);
  });

  return (
    <Paper className={classes.contentPaper}>
      <DashboardContext.Provider value={{ dashboard, dashboardDispatch }}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Server</TableCell>
              <TableCell align="right">CPU</TableCell>
              <TableCell align="right">RAM</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Task</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {servers.map(server => {
              const { _id, serverName, mem, cpu, active, taskID } = server;
              const netAve = server.network.map(s =>
                s.ifaces
                  .map(({ rx_bytes, tx_bytes }) => ({
                    rx_bytes,
                    tx_bytes
                  }))
                  .reduce(
                    (acc, curr) => ({
                      rx_bytes: acc.rx_bytes + curr.rx_bytes,
                      tx_bytes: acc.tx_bytes + curr.tx_bytes
                    }),
                    { rx_bytes: 0, tx_bytes: 0 }
                  )
              );
              console.log(netAve);
              return (
                <TableRow key={_id}>
                  <TableCell component="th" scope="row">
                    {serverName}
                  </TableCell>
                  <TableCell align="right">
                    <MemCPUProgressBar
                      value={
                        cpu.reduce((acc, c) => acc + c.currentload, 0) /
                        cpu.length
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <MemCPUProgressBar
                      value={
                        100 -
                        (100 * mem[mem.length - 1].free) /
                          mem[mem.length - 1].total
                      }
                    />
                  </TableCell>

                  <TableCell align="right">
                    {active ? "Online" : "Offline"}
                  </TableCell>
                  <TableCell align="right">{taskID}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </DashboardContext.Provider>
    </Paper>
  );
};

function MemCPUProgressBar(props) {
  const { value } = props;

  return (
    <Tooltip title={`${value.toFixed(2)} %`}>
      <LinearProgress variant="determinate" value={value} />
    </Tooltip>
  );
}
