import React, { useContext, useReducer, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { FileSearchContext } from "../../context/Search.Context";
import { ProjectContext } from "../../context/Project.Context";
import Axios from "axios";
import { api_server } from "../../environment/environment";
import Operations from "./Operations/Operations";
import ToolbarMain from "./Toolbar/Toolbar.Main";
import QuerybarMain from "./Querybar/Querybar.Main";
import ContentsVirtualTable from "./Contents/Contents.VirtualTable";
import { QueryGroupObject, QueryItemObject } from "../../util/search";

const useStyles = makeStyles(theme => ({
  contentPaper: {
    padding: "1rem",
    width: "100%"
  },
  mainGrid: {
    width: "100%",
    height: "100%"
  },
  subGrid: {
    height: "100%"
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
    height: "100%",
    color: theme.palette.text.secondary
  }
}));

export default () => {
  const classes = useStyles();
  const { activeProject } = useContext(ProjectContext);
  const [searchFileProps, searchFileDispatch] = useReducer(
    (state, action) => ({ ...state, ...action }),
    {
      project: activeProject,
      query: { project: activeProject },
      advancedQuery: QueryGroupObject("and", [
        QueryItemObject("fileName", "", "w"),
        QueryItemObject("size", "", "w")
      ]),
      scenes: [],
      count: 0,
      focusScene: null,
      selected: [],
      isAllSelected: false,
      rootPaths: [],
      sort: { extension: 1, fileName: 1 },
      skip: 0,
      limit: 30
    }
  );

  useEffect(() => {
    const rootPathsURL = `${api_server}/search/${activeProject}/unique/roots`;
    Axios.get(rootPathsURL).then(res => {
      searchFileDispatch({ rootPaths: res.data });
    });
  }, [activeProject]);

  return (
    <FileSearchContext.Provider value={{ searchFileProps, searchFileDispatch }}>
      <div className={classes.contentPaper}>
        <Grid container spacing={2} className={classes.subGrid}>
          <Grid className={classes.subGrid} item xs={12} sm={9}>
            <Paper className={classes.paper}>
              <QuerybarMain />
              <ToolbarMain />
              <ContentsVirtualTable />
            </Paper>
          </Grid>
          <Grid className={classes.subGrid} item xs={12} sm={3}>
            <Operations />
          </Grid>
        </Grid>
      </div>
    </FileSearchContext.Provider>
  );
};
