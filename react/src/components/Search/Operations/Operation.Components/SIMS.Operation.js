import React, { useContext, useState } from "react";
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
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns"; // import
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Axios from "axios";
import { api_server } from "../../../../environment/environment";

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

function OutputOption(extension, disabled, selected) {
  return { extension, disabled, selected };
}

export default params => {
  const { searchFileProps } = useContext(FileSearchContext);
  const { selected, project } = searchFileProps;

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
    )
  });

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

  // const { rootPaths, skip, limit, sort, query } = searchFileProps;
  // const { activeProject } = useContext(ProjectContext);
  // const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();
  const isRequestValid = () => {
    return Boolean(selected.length);
  };

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="root-path-panelbh-content"
        id="root-path-panelbh-header"
      >
        <Typography className={classes.heading}>SIMS</Typography>
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
            id="new-root-path"
            label="SIMS Location"
            value={options.simsLocation}
            onChange={handleSimsLocationChange}
            margin="dense"
            helperText={options.simsLocationHelperText}
          />
          <TextField
            label="Multiline"
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
        <IconButton
          disabled={!isRequestValid()}
          onClick={() => {
            const url = `${api_server}/tasks/new/SIMS`;
            const { simsLocation, version, commandLineArgs } = options;
            Axios.post(url, {
              project,
              fileIDs: selected,
              simsLocation,
              version,
              commandLineArgs
            }).then(results => {
              console.log(results.data);
            });
          }}
        >
          <SendIcon color={isRequestValid() ? "primary" : "disabled"} />
        </IconButton>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};

// function createOutputLocation(project, taskName, username, date, container) {
//   const output_base = "V:/JP01/DataLake/Common_Write/CLARITY_OUTPUT_FILES";
//   const timeStamp = dateToTextLabel(date);
//   return `${output_base}/${project}/${taskName}/${username}/${timeStamp}/${container}`;
// }

// function padZero(num) {
//   return num < 10 ? `0${num}` : String(num);
// }

// function dateToTextLabel(newDate) {
//   const yy = padZero(newDate.getFullYear());
//   const mo = padZero(newDate.getMonth() + 1);
//   const dd = padZero(newDate.getDate());
//   const hh = padZero(newDate.getHours());
//   const mn = padZero(newDate.getMinutes());
//   const ss = padZero(newDate.getSeconds());
//   return `${yy}${mo}${dd}_${hh}${mn}${ss}`;
// }

