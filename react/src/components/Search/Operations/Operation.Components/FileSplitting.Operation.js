import React, { useContext, useState, useEffect } from "react";
import { FileSearchContext } from "../../../../context/Search.Context";
import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";

import Axios from "axios";
import { api_server } from "../../../../environment/environment";
import { UserContext } from "../../../../context/User.Context";
import { useSnackbar } from "notistack";

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

export default params => {
  const { searchFileProps } = useContext(FileSearchContext);
  const { name } = useContext(UserContext);
  const { selected, project } = searchFileProps;
  const { expanded, handleExpanChange } = params;

  const [options, setOptions] = useState({
    splitFileFor: 1,
    splitFileForOptions: ["OD and WL", "TSR"],
    invalidFiles: []
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (key, value) => {
    setOptions({
      ...options,
      [key]: value
    });
  };

  const handleSubmitTasks = () => {
    const url = `${api_server}/tasks/File Splitting/new`;
    const {
      memoPoolPath,
      ibeoPoolPath,
      sensor,
      outputFolder,
      logFilePath
    } = options;
    Axios.post(url, {
      project,
      fileIDs: selected,
      memoPoolPath,
      ibeoPoolPath,
      sensor,
      outputFolder,
      logFilePath,
      requestedBy: name
    })
      .then(results => {
        const displayText = `${results.data.length} File Splitting tasks submitted`;
        enqueueSnackbar(displayText, { variant: "success" });
      })
      .catch(results => {
        enqueueSnackbar(
          "Request not sent due to bad connection. Please try again",
          { variant: "error" }
        );
      });
  };

  const classes = useStyles();
  const isRequestValid = () => {
    return Boolean(selected.length && !options.invalidFiles.length);
  };

  useEffect(() => {
    const url = `${api_server}/tasks/${project}/File Splitting/check-validity`;
    Axios.post(url, {
      fileIDs: selected
    }).then(results => {
      handleChange("invalidFiles", results.data.map(rd => rd.fileName));
    });
  }, [selected, project]);

  return (
    <ExpansionPanel
      expanded={expanded === "File Splitting"}
      onChange={handleExpanChange("File Splitting")}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="root-path-panelbh-content"
        id="root-path-panelbh-header"
      >
        <Tooltip
          title={`${options.invalidFiles.length} invalid, ${selected.length -
            options.invalidFiles.length} files`}
        >
          <Typography className={classes.heading}>File Splitting</Typography>
        </Tooltip>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
        <form noValidate autoComplete="off">
          <FormControl fullWidth className={classes.formControl}>
            <InputLabel htmlFor="splitFileFor-select">
              Split file for
            </InputLabel>
            <Select
              value={options.splitFileFor}
              onChange={event =>
                handleChange("splitFileFor", event.target.value)
              }
              inputProps={{
                name: "splitFileFor",
                id: "splitFileFor-select"
              }}
            >
              {options.splitFileForOptions.map((option, index) => (
                <MenuItem key={`sv-${option}`} value={index + 1}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </form>
      </ExpansionPanelDetails>
      <ExpansionPanelActions>
        <IconButton disabled={!isRequestValid()} onClick={handleSubmitTasks}>
          <SendIcon color={isRequestValid() ? "primary" : "disabled"} />
        </IconButton>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};
