import React from "react";
// import { FileSearchContext } from "../../../../context/Search.Context";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemIcon from "@material-ui/core/ListItemIcon";
// import ListItemText from "@material-ui/core/ListItemText";
// import Tooltip from "@material-ui/core/Tooltip";
// import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
// import Menu from "@material-ui/core/Menu";
// import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
// import Axios from "axios";
// import { api_server } from "../../../../environment/environment";
// import { ProjectContext } from "../../../../context/Project.Context";
// import { useSnackbar } from "notistack";
// import {
//   normalizeSize,
//   numberWithCommas,
//   normalizeTime
// } from "../../../../util/strings";
// import { fetchScenesData } from "../../../../util/scenes-search";

// let newRootDebounceTimer = null;

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

// function reducer(state, action) {
//   return { ...state, ...action };
// }

export default params => {
  // const { searchFileProps, searchFileDispatch } = useContext(FileSearchContext);
  // const { rootPaths, skip, limit, sort, query } = searchFileProps;

  // const { activeProject } = useContext(ProjectContext);
  // const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();

  return (
    <ExpansionPanel
      style={{ padding: 0 }}
      // expanded={expanded === "root-path-panel"}
      // onChange={handleChange("root-path-panel")}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="root-path-panelbh-content"
        id="root-path-panelbh-header"
      >
        <Typography className={classes.heading}>SIMS</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
        <form noValidate autoComplete="off">
          <TextField
            // error={!isNewRootValid}
            fullWidth
            required
            id="new-root-path"
            label="New Root Path"
            // value={newRoot}
            // onChange={handleNewRootChange}
            margin="normal"
            // helperText={getHelperText()}
          />
        </form>
      </ExpansionPanelDetails>
      <ExpansionPanelActions>
        <IconButton
        // disabled={!isNewRootValid || isSubmitted()}
        // onClick={handleNewRootPathSubmit}
        >
          <SendIcon
          // color={!isNewRootValid || isSubmitted() ? "disabled" : "primary"}
          />
        </IconButton>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};
