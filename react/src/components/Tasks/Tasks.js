import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
// import TaskTable from "./TaskTable/TaskTable";
// import Axios from "axios";
// import { api_server } from "../../environment/environment";
import { ProjectContext } from "../../context/Project.Context";
import VirtualTaskTable from "./TaskTable/VirtualTaskTable";

const useStyles = makeStyles(theme => ({
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    width: "100%"
  }
}));

export default props => {
  const classes = useStyles();
  const { activeProject } = useContext(ProjectContext);

  return (
    <Paper className={classes.contentPaper}>
      <VirtualTaskTable project={activeProject} />
    </Paper>
  );
};
