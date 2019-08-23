import React, { useContext, useReducer, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { FileSearchContext } from "../../context/Search.Context";
import { ProjectContext } from "../../context/Project.Context";
import Axios from "axios";
import { api_server } from "../../environment/environment";
import ContentsMain from "./Contents/Contents.Main";
import Operations from "./Operations/Operations";

const useStyles = makeStyles(theme => ({
  mainGrid: {
    flexGrow: 1,
    margin: "1rem",
    width: "100%",
    height: "100%"
  },
  subGrid: {
    height: "100%"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
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
      query: { project: activeProject, extension: "cvw" },
      scenes: [],
      focusScene: null,
      selected: [],
      rootPaths: [],
      order: "asc",
      orderBy: "_id",
      page: 0,
      rowsPerPage: 10
    }
  );

  const { page, rowsPerPage, query } = searchFileProps;

  useEffect(() => {
    const skip = page * rowsPerPage;
    const searchValueString = JSON.stringify(query);
    const scenesURL = `${api_server}/search/${activeProject}/${skip}/${rowsPerPage}/${searchValueString}`;
    const rootPathsURL = `${api_server}/search/${activeProject}/unique/roots`;
    Axios.get(scenesURL).then(res => {
      if (res.data.scenes.length) {
        searchFileDispatch({
          scenes: res.data.scenes,
          focusScene: res.data.scenes[0]._id
        });
      }
    });
    Axios.get(rootPathsURL).then(res => {
      searchFileDispatch({ rootPaths: res.data });
    });
  }, [page, rowsPerPage, query, activeProject]);

  return (
    <div className={classes.mainGrid}>
      <FileSearchContext.Provider
        value={{ searchFileProps, searchFileDispatch }}
      >
        <Grid container spacing={2} className={classes.subGrid}>
          <Grid className={classes.subGrid} item xs={12} sm={9}>
            <Paper className={classes.paper}>
              <div>Search Bar </div>
              <div>ToolBar</div>
              <ContentsMain />
            </Paper>
          </Grid>
          <Grid className={classes.subGrid} item xs={12} sm={3}>
            <Paper className={classes.paper}>
              <Operations />
            </Paper>
          </Grid>
        </Grid>
      </FileSearchContext.Provider>
    </div>
  );
};
