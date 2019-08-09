import React from "react";
import uuid from "uuid";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles, fade } from "@material-ui/core/styles";
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
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import InputBase from "@material-ui/core/InputBase";
import Axios from "axios";
import { api_server } from "../environment/environment";
import { ProjectContext } from "../context/Project.Context";
import Download from "../clientExports/DCSchedule";

var debounceTimer = null;
export function getHeaders(rows) {
  return rows
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
        index >= 0 && !isNaN(rows[index][key]),
        false,
        key
      );
    });
}

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
            key={uuid()}
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
    width: "100%",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.secondary.main
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
  const { numSelected, selected } = props;

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
            Test Catalog
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Download selected={selected} />
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
    width: "100%"
    // marginTop: theme.spacing(3)
  },
  table: {
    // tableLayout: "fixed",
    minWidth: "100%"
  },
  tableWrapper: {
    overflowX: "auto"
    // maxWidth: (window.innerWidth - drawerWidth) * 0.95
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  paper: {
    margin: "1rem",
    padding: "1rem"
  },
  search: {
    display: "flex",
    flexDirection: "row",
    verticalAlign: "middle",
    position: "relative",

    border: `0.05rem solid ${theme.palette.primary.main}`,
    borderRadius: "2rem",
    "&:hover": {
      backgroundColor: fade("#707070", 0.1)
    },
    marginLeft: 0,
    marginBottom: "1rem",
    width: "100%"
  },
  input: {
    width: "100%"
  }
}));

function SimpleSearch(props) {
  const { setSearchValue, dense, fetchData } = props;
  const { activeProject } = React.useContext(ProjectContext);
  const classes = useStyles();
  const [searchString, setSearchString] = React.useState("");

  function onSearchStringChange(search_string) {
    const regex = search_string.split(/[\s,]+/).join("|");
    const query = {
      $and: [
        { project: activeProject },
        {
          "Record ID": { $regex: regex, $options: "i" }
        }
      ]
    };

    setSearchString(search_string);
    setSearchValue(query);

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      fetchData(0, null, query);
    }, 1000);
  }

  return (
    <div className={classes.search}>
      <IconButton aria-label="Search" size={dense ? "small" : "medium"}>
        <SearchIcon color="primary" aria-label="Search" />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Search"
        inputProps={{ "aria-label": "Search" }}
        value={searchString}
        onChange={event => onSearchStringChange(event.target.value)}
      />
    </div>
  );
}

export default () => {
  const classes = useStyles();
  const { activeProject } = React.useContext(ProjectContext);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [feature, setFeature] = React.useState("");
  const [sheetOptions, setSheetOptions] = React.useState([]);
  const [selectedSheet, setSelectedSheet] = React.useState([]);
  const [headerOptions, setHeaderOptions] = React.useState([]);
  // const [selHeadersOption, setSelHeadersOption] = React.useState([]);
  const [query, setQuery] = React.useState({
    $and: [{ project: activeProject }]
  });
  const [bodyRows, setBodyRows] = React.useState([]);
  const [rowsLen, setRowsLen] = React.useState(0);
  const [headCols, setHeadCols] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");

  const fetchData = (_page, _rowsPerPage, _query) => {
    const p = _page === null ? page : _page;
    const rpp = _rowsPerPage ? _rowsPerPage : rowsPerPage;

    const queryString = JSON.stringify(_query ? _query : query);
    Axios.get(
      `${api_server}/tc/${activeProject}/${p}/${rpp}/${queryString}`
    ).then(res => {
      const { rows, count } = res.data;
      let headers = getHeaders(rows);

      setHeadCols(headers);
      setBodyRows(rows);
      setRowsLen(count);
    });
  };

  React.useEffect(() => {
    Axios.get(`${api_server}/tc/${activeProject}/unique/sheetName`).then(res =>
      setSheetOptions(res.data)
    );
    fetchData();
  }, []);

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      const newSelecteds = bodyRows.map(n => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }

  function handleClick(event, id) {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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
    fetchData(newPage, null, searchValue);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(+event.target.value);
    fetchData(0, event.target.value, searchValue);
    setPage(0);
  }

  function handleChangeDense(event) {
    setDense(event.target.checked);
  }

  // async function handleChangeFeature(event) {
  //   const newFeature = event.target.value;
  //   const newQuery = {
  //     $and: [
  //       { project: activeProject },
  //       { sheetName: { $regex: newFeature, $options: "i" } }
  //     ]
  //   };
  //   setQuery(newQuery);
  //   fetchData(page, rowsPerPage, newQuery);

  //   setFeature(newFeature);
  //   const { data } = await Axios.get(
  //     `${api_server}/tc/${activeProject}/unique/feature/${newFeature}`
  //   );

  //   setHeaderOptions(data);
  // }

  // async function handleChangeSheet(event) {
  //   const _selectedSheet = event.target.value;

  //   setSelectedSheet(_selectedSheet);

  //   const newQuery = {
  //     $and: [{ project: activeProject }, { sheetName: _selectedSheet }]
  //   };
  //   setQuery(newQuery);
  //   fetchData(page, rowsPerPage, newQuery);
  // }

  const isSelected = name => selected.indexOf(name) !== -1;

  // const totalHeaderWidth =
  //   headCols
  //     .map(col => (col.id === "Record ID" ? 15 : col.id.length))
  //     .reduce((sum, len) => sum + len, 0) + 2;
  // const headersLen = [2, ...headCols.map(col => col.id.length)].map(
  //   col => col / totalHeaderWidth
  // );

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
        <SimpleSearch
          setSearchValue={setSearchValue}
          dense={dense}
          fetchData={fetchData}
        />

        {/* <form className={classes.root} autoComplete="off">
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="feature-input">Feature</InputLabel>
            <Select
              value={feature}
              onChange={handleChangeFeature}
              inputProps={{
                name: "feature",
                id: "feature-input"
              }}
            >
              {sheetOptions.map(sheetOption => (
                <MenuItem key={sheetOption} value={sheetOption}>
                  {sheetOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl} disabled={!feature}>
            <InputLabel htmlFor="sheet input">Sheet</InputLabel>
            <Select
              value={selectedSheet}
              onChange={handleChangeSheet}
              inputProps={{
                name: "sheetname",
                id: "sheet-input"
              }}
            >
              {headerOptions.map(headerOption => (
                <MenuItem
                  key={"ho-" + headerOption.sheetName}
                  value={headerOption.sheetName}
                >
                  {headerOption.sheetName.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {headCols.map(col => (
            <FormControl
              className={classes.formControl}
              disabled={!feature}
              key={uuid()}
            >
              <InputLabel htmlFor={"col-" + col}>{col.id}</InputLabel>
              <Select
                value={selectedSheet}
                onChange={handleChangeSheet}
                inputProps={{
                  name: "col-" + col,
                  id: "sheet-col" + col
                }}
              />
            </FormControl>
          ))}
        </form> */}

        <EnhancedTableToolbar
          numSelected={selected.length}
          selected={bodyRows.filter(row => selected.includes(row._id))}
        />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            {/* <colgroup>
              {headersLen.map(header => (
                <col key={uuid()} style={{ width: `${header * 100}%` }} />
              ))}
            </colgroup> */}

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
              {stableSort(bodyRows, getSorting(order, orderBy)).map(
                (row, index) => {
                  const isItemSelected = isSelected(row._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row._id)}
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
                            padding="default"
                            key={`${col.id}-${row._id}`}
                          >
                            {row[col.id]}
                          </TableCell>
                        ) : (
                          <TableCell
                            align={col.numeric ? "right" : "left"}
                            key={`${col.id}-${row._id}`}
                          >
                            {row[col.id] !== null ? row[col.id] : null}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  );
                }
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20, 25, 50, 75, 100]}
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
