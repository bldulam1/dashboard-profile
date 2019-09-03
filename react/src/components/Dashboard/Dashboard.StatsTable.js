import React, { Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import WifiIcon from "@material-ui/icons/Wifi";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import LinearProgress from "@material-ui/core/LinearProgress";
import { normalizeSize } from "../../util/strings";

export default params => {
  const { servers } = params;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Server</TableCell>
          <TableCell align="right">CPU</TableCell>
          <TableCell align="right">RAM</TableCell>
          <TableCell align="right">Receive</TableCell>
          <TableCell align="right">Transmit</TableCell>
          <TableCell align="right">Status</TableCell>
          <TableCell align="right">Task</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {servers.map(server => {
          const { _id, serverName, mem, cpu, active, taskID } = server;

          return (
            <TableRow key={_id}>
              <TableCell component="th" scope="row">
                {serverName}
              </TableCell>
              <TableCell align="right">
                <MemCPUProgressBar value={active ? cpu : 0} />
              </TableCell>
              <TableCell align="right">
                <MemCPUProgressBar value={active ? mem : 0} />
              </TableCell>
              <TableCell align="right">{`${normalizeSize(
                server.rx_bytes
              )}/s`}</TableCell>
              <TableCell align="right">{`${normalizeSize(
                server.tx_bytes
              )}/s`}</TableCell>
              <TableCell align="right">
                {active ? (
                  <WifiIcon color="primary" />
                ) : (
                  <WifiOffIcon color="secondary" />
                )}
              </TableCell>
              <TableCell align="right">{taskID}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

function MemCPUProgressBar(props) {
  const { value } = props;
  const display = `${value.toFixed(2)} %`;

  return (
    <Tooltip title={display}>
      <LinearProgress variant="determinate" value={value} />
    </Tooltip>
  );
}
