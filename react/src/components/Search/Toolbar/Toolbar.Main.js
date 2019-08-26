import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { lighten } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
// import Tooltip from "@material-ui/core/Tooltip";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Switch from "@material-ui/core/Switch";
import { numberWithCommas } from "../../../util/strings";
import { FileSearchContext } from "../../../context/Search.Context";

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
    justifyContent: "end",
    color: theme.palette.text.secondary,
    width: "50%"
  },
  title: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    color: theme.palette.text.secondary,
    width: "50%"
  },
  totalTime: {
    alignSelf: "center"
  }
}));

export default props => {
  const classes = useToolbarStyles();
  const { searchFileProps } = React.useContext(FileSearchContext);
  const { selected, count } = searchFileProps;

  const numSelected = selected.length;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: true
      })}
    >
      <div className={classes.title}>
        <Typography color="inherit" variant="h6">
          Selected {numberWithCommas(numSelected)} of
          {` ${numberWithCommas(count)}`}
        </Typography>
      </div>
      <div className={classes.actions}>
        {/* <Tooltip title="Padding" placement="top">
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
        </Tooltip> */}
      </div>
    </Toolbar>
  );
};
