import React from "react";
import Paper from "@material-ui/core/Paper";
import { useStyles } from "../styles/classes";
import { api_server } from "../environment/environment";

export default props => {
  const classes = useStyles();
  return (
    <Paper className={classes.contentPaper}>
      {api_server}
    </Paper>
  );
};
