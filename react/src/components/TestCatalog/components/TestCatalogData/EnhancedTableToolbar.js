import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { lighten } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import { numberWithCommas } from "../../../../util/strings";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { TestCatalogContext } from "../../../../context/TestCatalog.Context";

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.primary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.light
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    color: theme.palette.text.secondary,
    width: "40%"
  },
  title: {
    width: "40%",
    flex: "0 0 auto"
  },
  totalTime: {
    alignSelf: "center"
  }
}));

export default props => {
  const classes = useToolbarStyles();
  const { tcProps, tcDispatch } = React.useContext(TestCatalogContext);
  const { selected, dense, count } = tcProps;

  const numSelected = selected.length;
  const totalTime = selected.reduce(
    (sum, row) => sum + (row.Time ? row.Time : 0),
    0
  );

  function handleChangeDense(event) {
    tcDispatch({
      dense: event.target.checked
    });
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="h6">
            Selected {numberWithCommas(numSelected)} of
            {` ${numberWithCommas(count)}`} entries
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            Filtered {numberWithCommas(count)} entries
          </Typography>
        )}
      </div>
      <div className={classes.spacer}>
        <Typography variant="subtitle2" className={classes.totalTime}>
          <b>Total Time</b> : <span>{totalTime} mins</span>
        </Typography>
      </div>
      <div className={classes.actions}>
        <Tooltip title="Padding" placement="top">
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={dense}
                onChange={handleChangeDense}
              />
            }
            label="Dense"
          />
        </Tooltip>
      </div>
    </Toolbar>
  );
};
