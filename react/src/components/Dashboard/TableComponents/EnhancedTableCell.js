import React from "react";
import TableCell from "@material-ui/core/TableCell";

export default params => {
  const { contents, index } = params;
  return index ? (
    <TableCell padding="checkbox" align="center">
      {contents}
    </TableCell>
  ) : (
    <TableCell padding="checkbox" component="th" scope="row" align="left">
      {contents}
    </TableCell>
  );
};
