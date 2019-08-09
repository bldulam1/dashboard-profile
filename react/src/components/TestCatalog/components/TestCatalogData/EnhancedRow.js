import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import { TestCatalogContext } from "../../../../context/TestCatalog.Context";

export default props => {
  const { row, index, handleClick, isSelected } = props;
  const { cols } = React.useContext(TestCatalogContext).tcProps;
  const isItemSelected = isSelected(row.name);
  const labelId = `enhanced-table-checkbox-${index}`;

  return (
    <TableRow
      hover
      onClick={event => handleClick(event, row.name)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.name}
      selected={isItemSelected}
    >
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isItemSelected}
          inputProps={{ "aria-labelledby": labelId }}
        />
      </TableCell>
      {cols.map((col, colIndex) =>
        col.id === "name" ? (
          <TableCell
            key={`th-${colIndex}`}
            component="th"
            id={labelId}
            scope="row"
            padding="none"
          >
            {row[col.id]}
          </TableCell>
        ) : (
          <TableCell key={`th-${colIndex}`} align="right">
            {row[col.id]}
          </TableCell>
        )
      )}
    </TableRow>
  );
};
