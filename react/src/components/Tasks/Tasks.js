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

export function fetchTasksData(project, skip, limit, sort, query, callback) {
  const sortString = JSON.stringify(sort);
  const queryString = JSON.stringify(query);
  const rootPathsURL = `${api_server}/tasks/${project}/skip=${skip}/limit=${limit}/sort=${sortString}/query=${queryString}`;
  Axios.get(rootPathsURL).then(res => {
    const { tasks, count } = res.data;
    callback({ tasks, count });
  });
}

const defaultState = {
  page: 0,
  rowsPerPage: 10,
  tasks: [],
  selected: [],
  sort: { requestDate: -1 },
  count: 0,
  order: "desc",
  orderBy: "requestDate"
};

export default props => {
  const classes = useStyles();
  const { activeProject } = useContext(ProjectContext);
  const [taskState, setTaskState] = useState(defaultState);

  useEffect(() => {
    const skip = defaultState.page * defaultState.rowsPerPage;
    const defaultQuery = { project: activeProject };
    fetchTasksData(
      activeProject,
      skip,
      defaultState.rowsPerPage,
      defaultState.sort,
      defaultQuery,
      ({ tasks, count }) => {
        setTaskState({
          ...defaultState,
          query: defaultQuery,
          tasks,
          count
        });
      }
    );
  }, [activeProject]);

  return (
    <Paper className={classes.contentPaper}>
      <TaskTable tasksState={taskState} setTaskState={setTaskState} />
    </Paper>
  );
};
