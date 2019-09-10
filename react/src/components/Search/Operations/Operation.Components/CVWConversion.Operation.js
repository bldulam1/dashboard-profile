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
import uuid from "uuid";
import { api_server } from "../../../../environment/environment";
import { UserContext } from "../../../../context/User.Context";
import { useSnackbar } from "notistack";
import { getSubHeadingText } from "../../../../util/search";
import { useOperationStyles } from "../../../../styles/operationsClasses";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

function CVW2MATOption(name, display, trueValue, falseValue, value) {
  return { name, display, trueValue, falseValue, value };
}

export default params => {
  const taskName = "CVW Conversion";
  const validExtension = "cvw";
  const { searchFileProps } = useContext(FileSearchContext);
  const { name } = useContext(UserContext).user;
  const { selected, project } = searchFileProps;
  const { expanded, handleExpanChange } = params;
  const { enqueueSnackbar } = useSnackbar();

  const [options, setOptions] = useState({
    priority: 0,
    priorityOptions: ["Low", "Medium", "High"],
    outputFormat: ["mat"],
    outputOptions: ["asc", "kml", "mat"],
    autoClean: false,
    expiryDate: new Date().setTime(
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000
    ),
    invalidFiles: [],
    others: [
      CVW2MATOption("adc", "ADC", "", "--no-adc", false),
      CVW2MATOption("can", "CAN", "", "--no-can", true),
      CVW2MATOption("ipcom", "IPCOM", "", "--no-ipcom", true),
      CVW2MATOption("detections", "Detections", "", "--no-detections", true),
      CVW2MATOption("oszi", "OSZI", "", "--no-oszi", true),
      CVW2MATOption("tracking", "Tracking", "", "--no-tracking", true),
      CVW2MATOption("freespace", "Free space", "", "--no-freespace", true),
      CVW2MATOption("allAntennas", "All Antennas", "", "--all-antennas", true),
      CVW2MATOption("rawADC", "Raw ADC", "", "--raw-adc", true),
      CVW2MATOption("lidar", "Lidar Tracker", "", "--no-lidar", false),
      CVW2MATOption(
        "csv_intersection",
        "Intersection CSV",
        "--intersection",
        "",
        false
      ),
      CVW2MATOption("csv_brake", "Brake CSV", "--brake", "", false),
      CVW2MATOption("pcap", "PCAP", "--pcap", "", false)
    ]
  });

  const handleChange = (key, value) => {
    setOptions({ ...options, [key]: value });
  };

  const handleOtherOptionChange = (key, value) => {
    let otherOptions = options.others;
    for (let index = 0; index < otherOptions.length; index++) {
      const element = otherOptions[index];
      if (element.name === key) {
        element.value = !element.value;
        break;
      }
    }
    setOptions({ ...options, others: otherOptions });
  };

  const handleSubmitTasks = () => {
    const url = `${api_server}/tasks/${taskName}/new`;
    const { priority, outputFormat, others } = options;
    const outputString = `${!outputFormat.includes("asc") ? "--no-asc" : ""} ${
      outputFormat.includes("kml") ? "--kml" : ""
    }`;
    Axios.post(url, {
      project,
      fileIDs: selected,
      requestedBy: name,
      priority,
      outputFormat,
      expiryDate: options.autoClean ? options.expiryDate : null,
      cli:
        others
          .map(other => (other.value ? other.trueValue : other.falseValue))
          .join(" ")
          .replace(/  +/g, " ") + outputString
    })
      .then(results => {
        const displayText = `${results.data.length} ${taskName} tasks submitted`;
        enqueueSnackbar(displayText, { variant: "success" });
      })
      .catch(() => {
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
  const handleDateChange = ndate => {
    handleChange("expiryDate", new Date(ndate));
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
            <InputLabel htmlFor="priority-select">Priority</InputLabel>
            <Select
              value={options.priority}
              onChange={event => handleChange("priority", event.target.value)}
              inputProps={{
                name: "priority",
                id: "priority-select"
              }}
            >
              {options.priorityOptions.map((option, opIndex) => (
                <MenuItem
                  key={`prio-${option}`}
                  value={opIndex}
                  disabled={false}
                >
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth className={classes.formControl}>
            <InputLabel htmlFor="outputFormat-select">Output Format</InputLabel>
            <Select
              value={options.outputFormat}
              multiple
              onChange={event =>
                handleChange("outputFormat", event.target.value)
              }
              inputProps={{
                name: "outputFormat",
                id: "outputFormat-select"
              }}
            >
              {options.outputOptions.map(output => (
                <MenuItem
                  key={`of-${output}`}
                  value={output}
                  disabled={output === "mat"}
                >
                  {output}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel>Other Options</FormLabel>
          </FormControl>
          <FormGroup></FormGroup>
          {options.others.map(option => (
            <FormControlLabel
              key={uuid()}
              control={
                <Checkbox
                  checked={option.value}
                  onChange={event =>
                    handleOtherOptionChange(option.name, event.target.value)
                  }
                  value={option.value}
                />
              }
              label={option.display}
            />
          ))}
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
