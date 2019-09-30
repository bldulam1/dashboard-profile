import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { lighten } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import { numberWithCommas } from "../../../../util/strings";
import { TestCatalogContext } from "../../../../context/TestCatalog.Context";
import { TextField, Slider } from "@material-ui/core";
import { fetchData } from "../../../../util/test-catalog";

const useToolbarStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "row",
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
    flexGrow: 1
  },
  actions: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "start",
    color: theme.palette.text.secondary
    // width: "40%"
  },
  title: {
    flexGrow: 1
    // width: "40%",
    // flex: "0 0 auto"
  },
  totalTime: {
    alignSelf: "center"
  }
}));

export default props => {
  let timeoutInterval = null;
  const classes = useToolbarStyles();
  const { tcProps, tcDispatch } = React.useContext(TestCatalogContext);
  const { selected, count, rowsPerPage, page } = tcProps;

  const numSelected = selected.length;
  const totalTime = selected.reduce(
    (sum, row) => sum + (row.Time ? row.Time : 0),
    0
  );

  function handleChangeRowsPerPage(newRPP) {
    const changes = {
      rowsPerPage: newRPP,
      page: parseInt(page * (rowsPerPage / newRPP))
    };
    clearTimeout(timeoutInterval);
    timeoutInterval = setTimeout(() => {
      fetchData({ ...tcProps, ...changes }, res => {
        tcDispatch({ ...res, ...changes });
      });
    }, 1000);
  }

  function handleChangePageIndex(newPage) {
    fetchData({ ...tcProps, page: newPage }, res => {
      tcDispatch({ ...res, page: newPage });
    });
  }

  const maxPage = Math.floor(count / rowsPerPage);
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
        <Tooltip title="Rows per page" placement="top">
          <TextField
            defaultValue={rowsPerPage}
            onChange={event => handleChangeRowsPerPage(event.target.value)}
            margin="dense"
            type="number"
            style={{ width: "5rem" }}
          />
        </Tooltip>
        <Tooltip title="Page Slider" placement="top">
          <Slider
            style={{ margin: "auto 1rem" }}
            defaultValue={page > maxPage ? maxPage : page}
            onChangeCommitted={(event, value) => handleChangePageIndex(value)}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            min={0}
            max={maxPage}
          />
        </Tooltip>
      </div>
    </Toolbar>
  );
};
