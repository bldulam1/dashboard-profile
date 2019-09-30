import React from "react";
import uuid from "uuid/v4";
import TableHead from "@material-ui/core/TableHead";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import TableRow from "@material-ui/core/TableRow";
import { TestCatalogContext } from "../../../../context/TestCatalog.Context";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
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
export default function(props) {
  const classes = useStyles;
  const { tcProps, tcDispatch } = React.useContext(TestCatalogContext);
  const { rows, selected, cols, order, orderBy } = tcProps;

  const numSelected = selected.length;
  const rowCount = rows.length;

  const { onSelectAllClick, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected !== rowCount}
            checked={numSelected > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all desserts" }}
          />
        </TableCell>
        {cols.map((col, index) => (
          <TableCell
            key={uuid()}
            align={index ? "right" : "left"}
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
