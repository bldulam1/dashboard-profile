import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Slider from "@material-ui/core/Slider";
import { allTasks } from "../../environment/config";
import uuid from "uuid/v4";
import { DashboardContext } from "../../context/Dashboard.Context";
import Axios from "axios";
import { api_server } from "../../environment/environment";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  panel: {
    marginBottom: theme.spacing(2)
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
}));
export default params => {
  const colHeaders = ["Type", "Count", ...allTasks];
  const classes = useStyles();
  const { dashboard, dashboardDispatch } = React.useContext(DashboardContext);
  const { serverTypes, servers } = dashboard;

  const handleChangeCommit = (typeIndex, taskIndex, value) => {
    let newServerTypes = serverTypes;
    newServerTypes[typeIndex].tasks[taskIndex].priority = value;
    const { tasks, _id } = newServerTypes[typeIndex];

    const url = `${api_server}/server-assignments/update/${_id}`;
    Axios.put(url, { tasks }).then(results => console.log(results.data));
    dashboardDispatch({ serverTypes: newServerTypes });
  };

  const countServerType = typeIndex => {
    if (!serverTypes[typeIndex]) return 0;
    const type = serverTypes[typeIndex].name;
    return servers.filter(server => server.type === type).length;
  };

  return (
    <ExpansionPanel className={classes.panel}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>Server Types</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Table>
          <TableHead>
            <TableRow>
              {colHeaders.map(ch => (
                <TableCell key={uuid()} align="right">
                  {ch}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(serverTypes || []).map((st, stIndex) => {
              const totalServers = countServerType(stIndex);
              const sliders = allTasks.map(task => {
                const taskIndex = st.tasks.findIndex(t => t.task === task);
                const priority =
                  taskIndex < 0 ? 0 : st.tasks[taskIndex].priority;
                const totalPriority = st.tasks.reduce(
                  (acc, { task, priority }) => acc + priority,
                  0
                );

                return (
                  <Slider
                    defaultValue={priority}
                    aria-labelledby="discrete-slider"
                    valueLabelFormat={value => `${Math.round(value)}%`}
                    valueLabelDisplay={priority ? "on" : "auto"}
                    onChangeCommitted={(event, value) =>
                      handleChangeCommit(stIndex, taskIndex, value)
                    }
                    step={100 / allTasks.length / (totalServers || 1)}
                    min={0}
                    max={priority + (100 - totalPriority)}
                    marks
                  />
                );
              });

              const rowValues = [st.name, totalServers, ...sliders];

              return (
                <TableRow key={st.name}>
                  {rowValues.map((rv, index) => (
                    <TableCell key={uuid()} align="right">
                      {rv}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
