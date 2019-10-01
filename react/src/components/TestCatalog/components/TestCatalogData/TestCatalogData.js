import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import EnhancedTableHead from "./EnhancedTableHead";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import { stableSort, getSorting } from "../../../../util/test-catalog";
import { TestCatalogContext } from "../../../../context/TestCatalog.Context";
import uuid from "uuid/v4";
import EnhancedRow from "./EnhancedRow";
import { FormControlLabel, Checkbox } from "@material-ui/core";

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
  }
}));

export default () => {
  const classes = useStyles();

  const { tcProps, tcDispatch } = React.useContext(TestCatalogContext);
  const {
    rows,
    selected,
    dense,
    order,
    orderBy,
    rowsPerPage,
    count,
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

  const isSelected = _id => selected.findIndex(s => s._id === _id) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length);

  return (
    <div className={classes.root}>
      <EnhancedTableToolbar numSelected={selected.length} count={count} />
      <div className={classes.tableWrapper}>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size="small"
        >
          <EnhancedTableHead
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
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
    </div>
  );
};
