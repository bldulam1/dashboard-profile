import React from "react";
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
          <TableCell padding="checkbox">Server</TableCell>
          <TableCell padding="checkbox" align="right">
            Status
          </TableCell>
          <TableCell padding="checkbox" align="right">
            CPU
          </TableCell>
          <TableCell padding="checkbox" align="right">
            RAM
          </TableCell>
          <TableCell padding="checkbox" align="right">
            Receive
          </TableCell>
          <TableCell padding="checkbox" align="right">
            Transmit
          </TableCell>
          <TableCell padding="checkbox" align="right">
            Task
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {servers.map(server => {
          const { _id, serverName, mem, cpu, active, taskID } = server;

          return (
            <TableRow key={_id}>
              <TableCell padding="checkbox" component="th" scope="row">
                {serverName}
              </TableCell>
              <TableCell padding="checkbox" align="right">
                {active ? (
                  <WifiIcon color="primary" />
                ) : (
                  <WifiOffIcon color="secondary" />
                )}
              </TableCell>
              <TableCell padding="checkbox" align="right">
                <MemCPUProgressBar value={active ? cpu : 0} />
              </TableCell>
              <TableCell padding="checkbox" align="right">
                <MemCPUProgressBar value={active ? mem : 0} />
              </TableCell>
              <TableCell padding="checkbox" align="right">{`${normalizeSize(
                server.rx_bytes
              )}/s`}</TableCell>
              <TableCell padding="checkbox" align="right">{`${normalizeSize(
                server.tx_bytes
              )}/s`}</TableCell>
              <TableCell padding="checkbox" align="right">
                {taskID}
              </TableCell>
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
