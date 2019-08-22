import React from "react";
import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    width: "100%"
  }
}));

export default props => {
  const classes = useStyles();

  return <Paper className={classes.contentPaper}>Test</Paper>;
};
