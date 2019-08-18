import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import {
  stableSort,
  getSorting,
  fetchData
} from "../../../../util/test-catalog";
import { TestCatalogContext } from "../../../../context/TestCatalog.Context";
import uuid from "uuid/v4";
import EnhancedRow from "./EnhancedRow";

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    marginTop: theme.spacing(3)
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: "100%"
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

export default () => {
  const classes = useStyles();

  const { tcProps, tcDispatch } = React.useContext(TestCatalogContext);
  const {
    cols,
    rows,
    selected,
    dense,
    order,
    orderBy,
    page,
    rowsPerPage,
    rowsPerPageOptions,
    count
  } = tcProps;

  function handleRequestSort(event, property) {
    const isDesc = orderBy === property && order === "desc";
    tcDispatch({
      order: isDesc ? "asc" : "desc",
      orderBy: property
    });
  }

  function handleSelectAllClick(event) {
    const newSelecteds = event.target.checked ? rows : [];
    tcDispatch({ selected: newSelecteds });
  }

  function handleClick(event, _id) {
    const selectedIndex = selected.findIndex(s => s._id === _id);
    const selectedRow = rows.filter(row => row._id === _id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, ...selectedRow);
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

    tcDispatch({ selected: newSelected });
  }

  function handleChangePage(event, newPage) {
    fetchData({ ...tcProps, page: newPage }, res => {
      tcDispatch({ ...res, page: newPage });
    });
  }

  function handleChangeRowsPerPage(event) {
    const newRPP = +event.target.value;
    const changes = {
      rowsPerPage: newRPP,
      page: parseInt((page * rowsPerPage) / newRPP)
    };
    fetchData({ ...tcProps, ...changes }, res => {
      tcDispatch({ ...res, ...changes });
    });
  }

  const isSelected = _id => selected.findIndex(s => s._id === _id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length);

  return (
    <div className={classes.root}>
      <EnhancedTableToolbar numSelected={selected.length} count={count} />
      <div className={classes.tableWrapper}>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size={dense ? "small" : "medium"}
        >
          <EnhancedTableHead
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            cols={cols}
          />
          <TableBody>
            {stableSort(rows, getSorting(order, orderBy)).map((row, index) => (
              <EnhancedRow
                key={uuid()}
                row={row}
                index={index}
                handleClick={handleClick}
                isSelected={isSelected}
              />
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: emptyRows * (dense ? 33 : 49) }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
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
  );
};
