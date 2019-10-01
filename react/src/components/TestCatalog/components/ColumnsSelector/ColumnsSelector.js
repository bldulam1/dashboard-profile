import React, { useEffect } from "react";
import { TestCatalogContext } from "../../../../context/TestCatalog.Context";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import uuid from "uuid/v4";
import { Typography } from "@material-ui/core";

export default () => {
  const { tcProps, tcDispatch } = React.useContext(TestCatalogContext);
  const { visibleColumns, cols, rows } = tcProps;
  function handleVisibleColumnsChange(column, isVisible) {
    const newVisibleColumns = isVisible
      ? [...visibleColumns].filter(vc => vc !== column)
      : [...visibleColumns, column];
    tcDispatch({
      visibleColumns: newVisibleColumns
    });
  }

  console.log(
    cols.filter(col => rows.findIndex(row => row[col.id] === null) < 0)
  );

  return (
    <div>
      <Typography> Column Selector</Typography>
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {[...cols.map(col => col.id), ...visibleColumns]
          .filter((x, i, a) => a.indexOf(x) === i)
          .map(colId => {
            const isVisible = visibleColumns.includes(colId);
            return (
              <FormControlLabel
                key={uuid()}
                control={
                  <Checkbox
                    value={colId}
                    checked={isVisible}
                    onChange={() =>
                      handleVisibleColumnsChange(colId, isVisible)
                    }
                  />
                }
                label={colId}
              />
            );
          })}
      </div>
    </div>
  );
};
