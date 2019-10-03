import React from "react";
import { TestCatalogContext } from "../../../../context/TestCatalog.Context";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import uuid from "uuid/v4";
import { Typography } from "@material-ui/core";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import makeStyles from "@material-ui/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  expansionPanelDetails: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between"
  }
}));

export default () => {
  const classes = useStyles();
  const { tcProps, tcDispatch } = React.useContext(TestCatalogContext);
  const { visibleColumns, cols } = tcProps;
  function handleVisibleColumnsChange(column, isVisible) {
    const newVisibleColumns = isVisible
      ? [...visibleColumns].filter(vc => vc !== column)
      : [...visibleColumns, column];
    tcDispatch({
      visibleColumns: newVisibleColumns
    });
  }

  return (
    <ExpansionPanel className={classes.expansionPanel}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>Column Selector</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
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
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
