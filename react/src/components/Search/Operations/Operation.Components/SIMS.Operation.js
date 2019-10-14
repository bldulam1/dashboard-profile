import React, { useContext, useState, useEffect } from "react";
import { FileSearchContext } from "../../../../context/Search.Context";
// import { makeStyles } from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import IconButton from "@material-ui/core/IconButton";
import SendIcon from "@material-ui/icons/Send";
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
// import Tooltip from "@material-ui/core/Tooltip";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Axios from "axios";
import { api_server } from "../../../../environment/environment";
import { UserContext } from "../../../../context/User.Context";
import { useSnackbar } from "notistack";
import { useOperationStyles } from "../../../../styles/operationsClasses";
import { getSubHeadingText } from "../../../../util/search";

// let newRootDebounceTimer = null;

// const useStyles = makeStyles(theme => ({
//   expansionPanelDetails: {
//     display: "flex",
//     flexDirection: "column"
//   },
//   root: {
//     width: "100%",
//     backgroundColor: theme.palette.background.paper
//   },
//   breakWord: {
//     wordWrap: "break-word"
//   }
// }));

function OutputOption(extension, disabled, selected) {
  return { extension, disabled, selected };
}

export default params => {
  const taskName = "SIMS";
  const validExtension = "cvw";
  const { searchFileProps } = useContext(FileSearchContext);
  const { name } = useContext(UserContext).user;
  const { selected, project } = searchFileProps;
  const { expanded, handleExpanChange } = params;

  const [options, setOptions] = useState({
    version: "SIMS_GEN12",
    versionOptions: ["SIMS_GEN12", "SIMS_GEN12_D"],
    simsLocation:
      "V:/JP01/DataLake/Common_Write/ClarityResources/SIMSapp_FCR_R7_31_70D5_9",
    simsLocationValid: true,
    simsLocationHelperText: "",
    commandLineArgs:
      "-ECU 10 -ReplayDetect -VehicleData AMP -CAN1 1 -CAN2 4 -CanReDir 1 -OutVss",
    outputs: ["log", "mat"],
    outputOptions: [
      OutputOption("asc", false, false),
      OutputOption("log", false, true),
      OutputOption("mat", false, true)
    ],
    outputLocation: "",
    autoClean: false,
    expiryDate: new Date().setTime(
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000
    ),
    invalidFiles: []
  });
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (key, value) => {
    setOptions({
      ...options,
      [key]: value
    });
  };

  const handleVersionChange = event =>
    handleChange("version", event.target.value);

  const handleSimsLocationChange = event =>
    handleChange("simsLocation", event.target.value);

  const handleAutoCleanCheckbox = event =>
    handleChange("autoClean", !options.autoClean);

  const handleCommandLineArgsChange = event =>
    handleChange("commandLineArgs", event.target.value);

  const handleDateChange = ndate => {
    handleChange("expiryDate", new Date(ndate));
  };

  const handleSubmitTasks = () => {
    const url = `${api_server}/tasks/${taskName}/new`;
    const { simsLocation, version, commandLineArgs, expiryDate } = options;
    Axios.post(url, {
      project,
      fileIDs: selected,
      simsLocation,
      version,
      commandLineArgs,
      requestedBy: name,
      expiryDate: options.autoClean ? expiryDate : null
    })
      .then(results => {
        const displayText = `${results.data.length} ${taskName} tasks submitted`;
        enqueueSnackbar(displayText, { variant: "success" });
      })
      .catch(results => {
        enqueueSnackbar(
          "Request not sent due to network problem. Please try again",
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
        aria-controls="sims-operation-panelbh-content"
        id="sims-operation-panelbh-header"
      >
        <Typography className={classes.heading}>{taskName}</Typography>
        <Typography className={classes.secondaryHeading}>
          {getSubHeadingText(options.invalidFiles, selected)}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
        <form noValidate autoComplete="off">
          <FormControl fullWidth className={classes.formControl}>
            <InputLabel htmlFor="version-select">SIMS Version</InputLabel>
            <Select
              value={options.version}
              onChange={handleVersionChange}
              inputProps={{
                name: "version",
                id: "version-select"
              }}
            >
              {options.versionOptions.map(version => (
                <MenuItem key={`sv-${version}`} value={version}>
                  {version}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            error={!options.simsLocationValid}
            fullWidth
            required
            id="new-sims-operation"
            label="SIMS Location"
            value={options.simsLocation}
            onChange={handleSimsLocationChange}
            margin="dense"
            helperText={options.simsLocationHelperText}
          />
          <TextField
            label="Command Line Input"
            fullWidth
            multiline
            rowsMax="4"
            value={options.commandLineArgs}
            onChange={handleCommandLineArgsChange}
            margin="dense"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={options.autoClean}
                onChange={handleAutoCleanCheckbox}
              />
            }
            label="Auto-clean output folder"
          />
        </form>
        {options.autoClean && (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              margin="dense"
              id="date-picker-dialog"
              label="Remove output files on"
              format="MM/dd/yyyy"
              value={options.expiryDate}
              onChange={handleDateChange}
              KeyboardButtonProps={{
                "aria-label": "change date"
              }}
            />
          </MuiPickersUtilsProvider>
        )}
      </ExpansionPanelDetails>
      <ExpansionPanelActions>
        <IconButton disabled={!isRequestValid()} onClick={handleSubmitTasks}>
          <SendIcon color={isRequestValid() ? "primary" : "disabled"} />
        </IconButton>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};
