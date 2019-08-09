import React from "react";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { TestCatalogContext } from "../../context/TestCatalog.Context";
import SimpleSearch from "./components/SimpleSearch";
import TestCatalogData from "./components/TestCatalogData/TestCatalogData";

const useStyles = makeStyles(theme => ({
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    width: "100%"
  }
}));

function reducer(state, action) {
  const { type, query } = action;

  switch (type) {
    case "Query":
      return { ...state, query };
    default:
      return state;
  }
}

export default props => {
  const classes = useStyles();
  const [tc, tcDispatch] = React.useReducer(reducer, {});

  return (
    <Paper className={classes.contentPaper}>
      <TestCatalogContext.Provider value={{ tc, tcDispatch }}>
        <SimpleSearch />
        <TestCatalogData />
      </TestCatalogContext.Provider>
    </Paper>
  );
};
