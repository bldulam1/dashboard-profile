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
import TextField from "@material-ui/core/TextField";
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

export default params => {
  const taskName = "IDW4 Conversion";
  const validExtension = "idw4";
  const { searchFileProps } = useContext(FileSearchContext);
  const { name } = useContext(UserContext);
  const { selected, project } = searchFileProps;
  const { expanded, handleExpanChange } = params;

  const [options, setOptions] = useState({
    memoPoolPath: "V:/JP01/DataLake/SVS350_DC/DC_Data/input/memo",
    ibeoPoolPath: "V:/JP01/DataLake/SVS350_DC/DC_Data/input/IBEO",
    sensor: "R",
    sensorOptions: ["R", "L"],
    outputFolder: "V:/JP01/DataLake/SVS350_DC/DC_Data/MasterFiles",
    logFilePath: "V:/JP01/DataLake/SVS350_DC/DC_Data/Log_MasterGen",
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
        aria-controls="idw4-conv-panelbh-content"
        id="idw4-conv-panelbh-header"
      >
        <Typography className={classes.heading}>{taskName}</Typography>
        <Typography className={classes.secondaryHeading}>
          {getSubHeadingText(options.invalidFiles, selected)}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
        <form noValidate autoComplete="off">
          <FormControl fullWidth className={classes.formControl}>
            <InputLabel htmlFor="sensor-select">Sensor R/L</InputLabel>
            <Select
              value={options.sensor}
              onChange={event => handleChange("version", event.target.value)}
              inputProps={{
                name: "sensor",
                id: "sensor-select"
              }}
            >
              {options.sensorOptions.map(version => (
                <MenuItem key={`sv-${version}`} value={version}>
                  {version}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            required
            id="memoPoolPath"
            label="Memo Pool Path"
            value={options.memoPoolPath}
            onChange={event => handleChange("memoPoolPath", event.target.value)}
            margin="dense"
          />

          <TextField
            fullWidth
            required
            id="ibeoPoolPath"
            label="IBEO Pool Path"
            value={options.ibeoPoolPath}
            onChange={event => handleChange("ibeoPoolPath", event.target.value)}
            margin="dense"
          />

          <TextField
            fullWidth
            required
            id="outputFolder"
            label="Output Folder"
            value={options.outputFolder}
            onChange={event => handleChange("outputFolder", event.target.value)}
            margin="dense"
          />

          <TextField
            fullWidth
            required
            id="logFilePath"
            label="Log File Output Location"
            value={options.logFilePath}
            onChange={event => handleChange("logFilePath", event.target.value)}
            margin="dense"
          />
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
