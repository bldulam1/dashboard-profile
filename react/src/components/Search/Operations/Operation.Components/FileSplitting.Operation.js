import React, { useContext, useState, useEffect } from "react";
import { FileSearchContext } from "../../../../context/Search.Context";
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

import Axios from "axios";
import { api_server } from "../../../../environment/environment";
import { UserContext } from "../../../../context/User.Context";
import { useSnackbar } from "notistack";
import { getSubHeadingText } from "../../../../util/search";
import { useOperationStyles } from "../../../../styles/operationsClasses";

// let newRootDebounceTimer = null;



export default params => {
  const taskName = "File Splitting";
  const validExtension = "dat";
  const { searchFileProps } = useContext(FileSearchContext);
  const { name } = useContext(UserContext).user;
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
    const url = `${api_server}/tasks/${taskName}/new`;
    const {
      splitFileFor
    } = options;
    Axios.post(url, {
      project,
      fileIDs: selected,
      splitFileFor,
      requestedBy: name
    })
      .then(results => {
        const displayText = `${results.data.length} ${taskName} tasks submitted`;
        enqueueSnackbar(displayText, { variant: "success" });
      })
      .catch(results => {
        enqueueSnackbar(
          "Request not sent due to bad connection. Please try again",
          { variant: "error" }
        );
      });
  };

  const classes = useOperationStyles();
  const isRequestValid = () => {
    return Boolean(selected.length && !options.invalidFiles.length);
  };

  useEffect(() => {
    const url = `${api_server}/tasks/check-extensions/${project}/${taskName}/ext=${validExtension}`;
    Axios.post(url, {
      fileIDs: selected
    }).then(results => {
      handleChange("invalidFiles", results.data.map(rd => rd.fileName));
    });
  }, [selected, project]);

  return (
    <ExpansionPanel
      expanded={expanded === taskName}
      onChange={handleExpanChange(taskName)}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="root-path-panelbh-content"
        id="root-path-panelbh-header"
      >
        <Typography className={classes.heading}>{taskName}</Typography>
        <Typography className={classes.secondaryHeading}>
          {getSubHeadingText(options.invalidFiles, selected)}
        </Typography>
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
