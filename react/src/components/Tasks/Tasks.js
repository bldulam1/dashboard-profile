import React, { useEffect, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TaskTable from "./TaskTable/TaskTable";
import Axios from "axios";
import { api_server } from "../../environment/environment";
import { ProjectContext } from "../../context/Project.Context";

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
  const [taskState, setTaskState] = useState({
    page: 0,
    query: { project: activeProject },
    tasks: [],
    selected: [],
    count: 0
  });

  useEffect(() => {
    const rootPathsURL = `${api_server}/tasks/${activeProject}/skip=0/limit=0/sort={}/query={}`;
    Axios.get(rootPathsURL).then(res => {
      const { tasks, count } = res.data;
      console.log({ tasks, count });
    });
  }, [activeProject]);

  return (
    <Paper className={classes.contentPaper}>
      <TaskTable />
    </Paper>
  );
};
