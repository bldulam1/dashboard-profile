import React from "react";
import Paper from "@material-ui/core/Paper";
import { useStyles } from "../styles/classes";

export default props => {
  const classes = useStyles();

  return <Paper className={classes.contentPaper}>Maps</Paper>;
};
