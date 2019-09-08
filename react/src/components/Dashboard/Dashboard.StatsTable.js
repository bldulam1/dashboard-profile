import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import WifiIcon from "@material-ui/icons/Wifi";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import LinearProgress from "@material-ui/core/LinearProgress";
import { normalizeSize } from "../../util/strings";
import uuid from "uuid/v4";
import EnhancedTableCell from "./TableComponents/EnhancedTableCell";

export default params => {
  const { servers } = params;
  const colHeaders = [
    "Server",
    "Status",
    "CPU",
    "RAM",
    "Receive",
    "Transmit",
    "Task"
  ];

  return (
    <Table>
      <TableHead>
        <TableRow>
          {colHeaders.map((ch, chI) => (
            <EnhancedTableCell key={uuid()} contents={ch} index={chI} />
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {servers.map(server => {
          const { _id, serverName, mem, cpu, active, taskID } = server;
          const activeStatus = active ? (
            <WifiIcon color="primary" />
          ) : (
            <WifiOffIcon color="secondary" />
          );

          const rowValues = [
            serverName,
            activeStatus,
            <MemCPUProgressBar value={active ? cpu : 0} />,
            <MemCPUProgressBar value={active ? mem : 0} />,
            `${normalizeSize(server.rx_bytes)}/s`,
            `${normalizeSize(server.tx_bytes)}/s`,
            taskID
          ];

          return (
            <TableRow key={_id}>
              {rowValues.map((rv, index) => (
                <EnhancedTableCell key={uuid()} contents={rv} index={index} />
              ))}
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
