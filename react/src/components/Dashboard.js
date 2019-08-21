import React, { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    width: "100%"
  }
}));

export default props => {
  const classes = useStyles();
  // useEffect(() => {
  //   return () => {
  //   };
  // }, [])

  return <Paper className={classes.contentPaper}>Dashboard</Paper>;
};
