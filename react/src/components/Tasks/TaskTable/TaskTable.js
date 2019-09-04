import React, { useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FilterListIcon from "@material-ui/icons/FilterList";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import ScheduleIcon from "@material-ui/icons/Schedule";

import CircularProgress from "@material-ui/core/CircularProgress";
import { fetchTasksData } from "../Tasks";
import { api_server } from "../../../environment/environment";
import Axios from "axios";

let intervalTimer = null;

const headCols = [
  {
    id: "inputFile",
    numeric: false,
    disablePadding: true,
    label: "Input File"
  },
  { id: "operation", numeric: true, disablePadding: false, label: "Operation" },
  {
    id: "requestedBy",
    numeric: true,
    disablePadding: false,
    label: "Requester"
  },
  {
    id: "requestDate",
    numeric: true,
    disablePadding: false,
    label: "Request Date"
  },
  {
    id: "assignedWorker",
    numeric: true,
    disablePadding: false,
    label: "Server"
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status"
  }
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {headCols.map(col => (
          <TableCell
            key={col.id}
            align={col.numeric ? "right" : "left"}
            padding={col.disablePadding ? "none" : "default"}
            sortDirection={orderBy === col.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === col.id}
              direction={order}
              onClick={createSortHandler(col.id)}
            >
              {col.label}
              {orderBy === col.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Tasks
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3)
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  tableWrapper: {
    overflowX: "auto"
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

export default params => {
  const classes = useStyles();
  const { tasksState, setTaskState } = params;
  const {
    project,
    tasks,
    sort,
    count,
    rowsPerPage,
    page,
    query,
    selected,
    order,
    orderBy
  } = tasksState;

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    const newSort = { [property]: isDesc ? 1 : -1 };

    fetchTasksData(
      project,
      page * rowsPerPage,
      rowsPerPage,
      newSort,
      query,
      ({ tasks }) => {
        setTaskState({
          ...tasksState,
          tasks,
          order: isDesc ? "asc" : "desc",
          orderBy: property,
          sort: newSort
        });
      }
    );
    // setOrder(isDesc ? "asc" : "desc");
    // setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const queryString = JSON.stringify(query);
      Axios.get(
        `${api_server}/tasks/${project}/get-ids/query=${queryString}`
      ).then(results => {
        setTaskState({ ...tasksState, selected: results.data });
      });
    } else {
      setTaskState({ ...tasksState, selected: [] });
    }
  }

  function handleClick(event, taskID) {
    const selectedIndex = selected.indexOf(taskID);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, taskID);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setTaskState({
      ...tasksState,
      selected: newSelected
    });
  }

  function handleChangePage(event, newPage) {
    fetchTasksData(
      project,
      newPage * rowsPerPage,
      rowsPerPage,
      sort,
      query,
      ({ tasks, count }) => {
        setTaskState({
          ...tasksState,
          page: newPage,
          tasks,
          count
        });
      }
    );
  }

  function handleChangeRowsPerPage(event) {
    const newRowsPerPage = +event.target.value;
    const newPage = 0;

    fetchTasksData(
      project,
      newPage,
      newRowsPerPage,
      sort,
      query,
      ({ tasks, count }) => {
        setTaskState({
          ...tasksState,
          page: newPage,
          rowsPerPage: newRowsPerPage,
          tasks,
          count
        });
      }
    );
  }

  const isSelected = id => selected.indexOf(id) !== -1;

  useEffect(() => {
    clearInterval(intervalTimer);

    const hasUnFinishedTasks = () => {
      for (let taskIndex = 0; taskIndex < tasks.length; taskIndex++) {
        if (!tasks[taskIndex].status || tasks[taskIndex].status.value < 2) {
          return true;
        }
      }
      return false;
    };

    if (hasUnFinishedTasks()) {
      console.log('is looping')
      intervalTimer = setInterval(() => {
        if (hasUnFinishedTasks()) {
          fetchTasksData(
            project,
            page,
            rowsPerPage,
            sort,
            query,
            ({ tasks, count }) => {
              setTaskState({
                ...tasksState,
                page,
                rowsPerPage,
                tasks,
                count
              });
            }
          );
        }
      }, 1000);
    }

    return () => clearInterval(intervalTimer);
  });

  return (
    <div className={classes.root}>
      <div className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={count}
            />
            <TableBody>
              {tasks.map((task, index) => {
                const isItemSelected = isSelected(task._id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={event => handleClick(event, task._id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={task._id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {task.inputFile}
                    </TableCell>
                    <TableCell align="right">{task.operation}</TableCell>
                    <TableCell align="right">{task.requestedBy}</TableCell>
                    <TableCell align="right">
                      {new Date(task.requestDate).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">{task.assignedWorker}</TableCell>
                    <TableCell align="right">
                      {task.status ? <RenderStatus status={task.status} /> : ""}
                    </TableCell>
                  </TableRow>
                );
              })}
              {rowsPerPage > tasks.length && (
                <TableRow style={{ height: 33 * (rowsPerPage - tasks.length) }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "previous page"
          }}
          nextIconButtonProps={{
            "aria-label": "next page"
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
};

function RenderStatus(params) {
  const { status } = params;

  return (
    <Tooltip title={status.text}>
      <div>
        {status.text === "Completed" && <CheckCircleIcon color="primary" />}
        {status.text === "In Progress" && (
          <CircularProgress size={20} color="secondary" />
        )}
        {status.text === "Pending" && <ScheduleIcon color="default" />}
        {status.text === "Aborted" && <ErrorIcon color="error" />}
      </div>
    </Tooltip>
  );
}
