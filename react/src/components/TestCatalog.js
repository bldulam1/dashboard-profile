import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
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
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import Axios from "axios";
import { api_server } from "../environment/environment";
import { ProjectContext } from "../context/Project.Context";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  } else if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

function createHeader(id, numeric, disablePadding, label) {
  return { id, numeric, disablePadding, label };
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCols
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "Select all desserts" }}
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
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
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
            Nutrition
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
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
    margin: "1rem",
    padding: "1rem"
  },
  table: {
    minWidth: 750
  },
  tableWrapper: {
    overflowX: "auto"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  }
}));

export default () => {
  const classes = useStyles();
  const { activeProject } = React.useContext(ProjectContext);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [feature, setFeature] = React.useState("");
  const [sheetOptions, setSheetOptions] = React.useState([]);
  const [headerOptions, setHeaderOptions] = React.useState([]);
  const [generalHeaders, setGeneralHeaders] = React.useState([]);
  const [query, setQuery] = React.useState({ project: activeProject });
  const [bodyRows, setBodyRows] = React.useState([]);
  const [rowsLen, setRowsLen] = React.useState(0);
  const [headCols, setHeadCols] = React.useState([]);

  React.useEffect(() => {
    Axios.get(`${api_server}/tc/${activeProject}/unique/sheetName`).then(res =>
      setSheetOptions(res.data)
    );
    fetchData();
  }, []);

  function fetchData(_page, _rowsPerPage) {
    const queryString = JSON.stringify(query);
    const p = _page  === null ? page : _page;
    const rpp = _rowsPerPage ? _rowsPerPage : rowsPerPage;
    Axios.get(
      `${api_server}/tc/${activeProject}/${p}/${rpp}/${queryString}`
    ).then(res => {
      const { rows, count } = res.data;
      let header = rows
        .map(row =>
          Object.keys(row).filter(
            key => !["sheetName", "_id", "__v", "project"].includes(key)
          )
        )
        .reduce((acc, curr) => [...new Set([...acc, ...curr])], [])
        .map(key => {
          const index = rows.findIndex(row => row[key]);
          return createHeader(
            key,
            !isNaN(rows[index][key]),
            ["Record ID"].includes(key),
            key
          );
        });

      setHeadCols(header);
      setBodyRows(rows);
      setRowsLen(count);
    });
  }
  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = bodyRows.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleClick(event, name) {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

    setSelected(newSelected);
  }

  function handleChangePage(event, newPage) {
    setPage(newPage);
    fetchData(newPage)
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    fetchData(0, event.target.value);
    setPage(0);
  }

  function handleChangeDense(event) {
    setDense(event.target.checked);
  }

  function handleChangeFeature(event) {
    const newFeature = event.target.value;
    setFeature(newFeature);
    Axios.get(
      `${api_server}/tc/${activeProject}/unique/feature/${newFeature}`
    ).then(res => {
      setHeaderOptions(res.data);
      const _allHeaders = res.data.reduce(
        (acc, curr) => [...new Set([...acc, ...curr.headers])].sort(),
        []
      );

      setGeneralHeaders(_allHeaders);
    });
  }

  const isSelected = name => selected.indexOf(name) !== -1;

  // const emptyRows =
  //   rowsPerPage - Math.min(rowsPerPage, bodyRows.length - page * rowsPerPage);
  const emptyRows = 0;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={dense}
              onChange={handleChangeDense}
            />
          }
          label="Dense padding"
        />
        <form className={classes.root} autoComplete="off">
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">Feature</InputLabel>
            <Select
              value={feature}
              onChange={handleChangeFeature}
              inputProps={{
                name: "age",
                id: "age-simple"
              }}
            >
              {sheetOptions.map(sheetOption => (
                <MenuItem key={sheetOption} value={sheetOption}>
                  {sheetOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>

        <EnhancedTableToolbar numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={bodyRows.length}
              headCols={headCols}
            />
            <TableBody>
              {stableSort(bodyRows, getSorting(order, orderBy))
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      {headCols.map(col =>
                        ["Record ID"].includes(col.id) ? (
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            key={`${col.id}-${row._id}`}
                          >
                            {row[col.id]}
                          </TableCell>
                        ) : (
                          <TableCell align="right" key={`${col.id}-${row._id}`}>
                            {row[col.id] ? row[col.id] : null}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rowsLen}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};
