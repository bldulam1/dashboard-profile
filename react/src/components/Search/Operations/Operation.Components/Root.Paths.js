import React, { useContext, useReducer, useEffect } from "react";
import { FileSearchContext } from "../../../../context/Search.Context";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import ListItemText from "@material-ui/core/ListItemText";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/styles";
import Axios from "axios";
import { api_server } from "../../../../environment/environment";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import SendIcon from "@material-ui/icons/Send";
import { ProjectContext } from "../../../../context/Project.Context";
import { useSnackbar } from "notistack";
import {
  normalizeSize,
  numberWithCommas,
  normalizeTime
} from "../../../../util/strings";
import { fetchScenesData } from "../../../../util/scenes-search";

let newRootDebounceTimer = null;

const useStyles = makeStyles(theme => ({
  expansionPanelDetails: {
    display: "flex",
    flexDirection: "column"
  },
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  breakWord: {
    wordWrap: "break-word"
  }
}));

function Info({ content, keyName }) {
  const { breakWord } = useStyles();
  return (
    <Typography
      component="div"
      variant="caption"
      className={breakWord}
      color="textPrimary"
    >
      <b style={{ marginRight: "0.5rem" }}>{keyName}</b>
      {content}
    </Typography>
  );
}
function reducer(state, action) {
  return { ...state, ...action };
}

export default params => {
  const { searchFileProps, searchFileDispatch } = useContext(FileSearchContext);
  const { rootPaths, skip, limit, sort, query } = searchFileProps;
  const { expanded, handleExpanChange } = params;

  const { activeProject } = useContext(ProjectContext);
  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();
  const [rootPath, rootPathDispatch] = useReducer(reducer, {
    anchorEl: null,
    newRoot: "",
    searchStatus: {
      isSearching: false,
      unMappedRoots: []
    },
    isNewRootValid: false,
    newRootInvalidMsg: "",
    submittedValues: []
  });
  const {
    anchorEl,
    newRoot,
    isNewRootValid,
    newRootInvalidMsg,
    submittedValues,
    searchStatus
  } = rootPath;

  function handleRootMenuClick(event) {
    rootPathDispatch({ anchorEl: event.currentTarget });
  }

  function handleClose() {
    rootPathDispatch({ anchorEl: null });
  }

  function handleRootPathOperation(path, operation) {
    if (operation === "remove") {
      const url = `${api_server}/fs/del-dir/${activeProject}/${path}`;
      Axios.delete(url)
        .then(results => {
          const { deletedCount, n } = results.data;
          const deletedCountComma = numberWithCommas(deletedCount);
          const nComma = numberWithCommas(n);
          const displayText = `Removed ${deletedCountComma} out of ${nComma} files from ${path}`;
          enqueueSnackbar(displayText, { variant: "success" });
        })
        .then(() => refreshRootPaths());
    }
    handleClose();
  }

  const isSubmitted = () => {
    return submittedValues.includes(newRoot);
  };

  const refreshRootPaths = () => {
    fetchScenesData(
      { project: activeProject, skip, limit, sort, query },
      results => {
        searchFileDispatch({ ...results });
        rootPathDispatch({
          searchStatus: {
            isSearching: false
          }
        });
      }
    );

    const rootPathsURL = `${api_server}/search/${activeProject}/unique/roots`;
    Axios.get(rootPathsURL).then(res => {
      searchFileDispatch({ rootPaths: res.data });
    });
  };

  // const rootPathSearchStatus = () => {
  //   const url = `${api_server}/fs/${activeProject}/unmapped-dirs`;
  //   Axios.get(url).then(results => {
  //     rootPathDispatch({
  //       searchStatus: {
  //         unMappedRoots: results.data
  //       }
  //     });
  //   });
  // };

  function handleNewRootPathSubmit(event) {
    event && event.preventDefault();
    if (isNewRootValid) {
      rootPathDispatch({
        newRoot: "",
        submittedValues: [...submittedValues, newRoot],
        searchStatus: {
          isSearching: true
        }
      });
      Axios.get(`${api_server}/fs/map-dir/${activeProject}/${newRoot}`)
        .then(results => {
          const { filesCount, elapsedTime } = results.data;
          const filesWithComma = numberWithCommas(filesCount);
          const normalTime = normalizeTime(elapsedTime);
          const displayText = `Found ${filesWithComma} files from ${newRoot} in ${normalTime}`;
          enqueueSnackbar(displayText, { variant: "success" });
        })
        .then(() => {
          refreshRootPaths();
        });
    }
  }

  const handleNewRootChange = event => {
    const path = event.target.value;
    rootPathDispatch({ newRoot: path, isNewRootValid: false });
    clearTimeout(newRootDebounceTimer);

    newRootDebounceTimer = setTimeout(() => {
      Axios.get(`${api_server}/fs/is-directory-exist/${path}`).then(results => {
        rootPathDispatch({
          isNewRootValid: results.data,
          newRootInvalidMsg: !results.data
            ? "This root path either does not exist or inaccessible by the server"
            : ""
        });
      });
    }, 750);
  };

  useEffect(() => {
    const url = `${api_server}/fs/${activeProject}/unmapped-dirs`;
    Axios.get(url).then(results => {
      rootPathDispatch({
        searchStatus: {
          unMappedRoots: results.data
        }
      });
    });
  }, [activeProject]);

  const getHelperText = () => {
    if (isSubmitted()) {
      return "This root path has already been submitted";
    } else if (!isNewRootValid && newRoot.length) {
      return newRootInvalidMsg;
    } else if (!newRoot.length) {
      return "Please provide a valid directory location";
    } else if (searchStatus.isSearching) {
      return "Currently searching";
    }
  };

  // rootPathSearchStatus();
  return (
    <ExpansionPanel
      style={{ padding: 0 }}
      expanded={expanded === "Root Paths"}
      onChange={handleExpanChange("Root Paths")}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="root-path-panelbh-content"
        id="root-path-panelbh-header"
      >
        <Typography className={classes.heading}>Root Paths</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
        <Typography variant="caption">Mapped Directories</Typography>
        <List className={classes.root}>
          {rootPaths.map(({ _id, totalSize, count, date }, index) => {
            const labelId = `checkbox-list-label-${index}`;
            return (
              <ListItem key={_id} role={undefined} style={{ padding: 0 }}>
                <ListItemIcon style={{ minWidth: "1rem" }}>
                  <div>
                    <IconButton
                      color="primary"
                      className={classes.button}
                      aria-label="Root path operation"
                      component="span"
                      aria-haspopup="true"
                      onClick={handleRootMenuClick}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem
                        onClick={() => handleRootPathOperation(_id, "reload")}
                        dense
                      >
                        Reload
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleRootPathOperation(_id, "remove")}
                        dense
                      >
                        Remove
                      </MenuItem>
                    </Menu>
                  </div>
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  id={labelId}
                  primary={
                    <Typography
                      component="div"
                      variant="body2"
                      className={classes.breakWord}
                    >
                      {_id}
                    </Typography>
                  }
                  secondary={
                    <div>
                      <Info
                        keyName={normalizeSize(totalSize)}
                        content="total size"
                      />
                      <Info keyName={numberWithCommas(count)} content="files" />
                      <Info
                        keyName={new Date(date).toLocaleString()}
                        content="last mapped"
                      />
                    </div>
                  }
                />
              </ListItem>
            );
          })}
        </List>

        <form noValidate autoComplete="off" onSubmit={handleNewRootPathSubmit}>
          <TextField
            error={!isNewRootValid}
            fullWidth
            required
            id="new-root-path"
            label="New Root Path"
            value={newRoot}
            onChange={handleNewRootChange}
            margin="normal"
            helperText={getHelperText()}
          />
        </form>
      </ExpansionPanelDetails>
      <ExpansionPanelActions>
        <IconButton
          disabled={!isNewRootValid || isSubmitted()}
          onClick={handleNewRootPathSubmit}
        >
          <SendIcon
            color={!isNewRootValid || isSubmitted() ? "disabled" : "primary"}
          />
        </IconButton>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};
