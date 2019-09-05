import React, { useContext } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import WifiIcon from "@material-ui/icons/Wifi";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import uuid from "uuid/v4";
import Checkbox from "@material-ui/core/Checkbox";
import { allTasks } from "../../environment/config";
import Axios from "axios";
import { api_server } from "../../environment/environment";
import { DashboardContext } from "../../context/Dashboard.Context";

export default () => {
  const { dashboard, dashboardDispatch } = useContext(DashboardContext);
  const { servers } = dashboard;

  const handleTaskClick = (taskName, serverID) => {
    const serverIndex = servers.findIndex(server => server._id === serverID);
    const newAllowedTasks = servers[serverIndex].allowedTasks.includes(taskName)
      ? servers[serverIndex].allowedTasks.filter(t => t !== taskName)
      : [...servers[serverIndex].allowedTasks, taskName];

    const url = `${api_server}/service-workers/update/${serverID}`;

    Axios.put(url, { allowedTasks: newAllowedTasks }).then(results => {
      let newServers = servers;
      newServers[serverIndex].allowedTasks = newAllowedTasks;
      dashboardDispatch({ servers: newServers });
    });
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">Server</TableCell>
            <TableCell padding="checkbox" align="right">
              Server Type
            </TableCell>
            <TableCell padding="checkbox" align="right">
              Status
            </TableCell>
            {allTasks.map(task => (
              <TableCell padding="checkbox" key={uuid()} align="right">
                {task}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {servers.map(server => {
            const { _id, serverName, active } = server;

            return (
              <TableRow key={_id}>
                <TableCell padding="checkbox" component="th" scope="row">
                  {serverName}
                </TableCell>
                <TableCell padding="checkbox" align="right">
                  Server Type
                </TableCell>
                <TableCell padding="checkbox" align="right">
                  {active ? (
                    <WifiIcon color="primary" />
                  ) : (
                    <WifiOffIcon color="secondary" />
                  )}
                </TableCell>
                {allTasks.map(taskName => (
                  <TableCell padding="checkbox" key={uuid()} align="right">
                    <Checkbox
                      color="primary"
                      checked={server.allowedTasks.includes(taskName)}
                      onChange={() => handleTaskClick(taskName, _id)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
