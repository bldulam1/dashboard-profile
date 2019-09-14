import React, { useContext, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import WifiIcon from "@material-ui/icons/Wifi";
import WifiOffIcon from "@material-ui/icons/WifiOff";
import uuid from "uuid/v4";
// import Checkbox from "@material-ui/core/Checkbox";
// import { allTasks } from "../../environment/config";
import Axios from "axios";
import { api_server } from "../../environment/environment";
import { DashboardContext } from "../../context/Dashboard.Context";
import EnhancedTableCell from "./TableComponents/EnhancedTableCell";
import DashboardSettings from "./Dashboard.Settings";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
export default () => {
  const { dashboard, dashboardDispatch } = useContext(DashboardContext);
  const { servers, serverTypes } = dashboard;

  const handleTypeChange = (serverID, type) => {
    const serverIndex = servers.findIndex(server => server._id === serverID);
    const url = `${api_server}/service-workers/update/${serverID}`;

    Axios.put(url, { type }).then(results => {
      let newServers = servers;
      newServers[serverIndex].type = results.data.type;
      dashboardDispatch({ servers: newServers });
    });
  };

  const colHeaders = [
    "Server",
    "Status",
    "Type",
    "Maximum Parallel Tasks",
    "Total Cores"
  ];

  const ServerTypeSelection = props => {
    const { server, _id } = props;

    return (
      <FormControl fullWidth>
        <Select
          fullWidth
          value={server.type}
          onChange={event => handleTypeChange(_id, event.target.value)}
          inputProps={{
            name: "type",
            id: "type-simple"
          }}
        >
          <MenuItem value="undefined"></MenuItem>
          {serverTypes.map(st => (
            <MenuItem key={uuid()} value={st.name}>
              {st.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  return (
    <div>
      <DashboardSettings />
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
            const { _id, serverName, active, cores } = server;
            const activeStatus = active ? (
              <WifiIcon color="primary" />
            ) : (
              <WifiOffIcon color="secondary" />
            );

            const rowValues = [
              serverName,
              activeStatus,
              <ServerTypeSelection server={server} _id={_id} />,
              1,
              cores
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
    </div>
  );
};
