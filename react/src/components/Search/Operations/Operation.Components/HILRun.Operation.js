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
import TextField from "@material-ui/core/TextField";
import DateFnsUtils from "@date-io/date-fns";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Tooltip from "@material-ui/core/Tooltip";
import Axios from "axios";
import { api_server } from "../../../../environment/environment";
import { UserContext } from "../../../../context/User.Context";
import { useSnackbar } from "notistack";
import uuid from "uuid/v4";
import { FormLabel, FormGroup } from "@material-ui/core";
import { getSubHeadingText } from "../../../../util/search";
import { useOperationStyles } from "../../../../styles/operationsClasses";

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
  const taskName = "HIL";
  const validExtension = "cvw";
  const { searchFileProps } = useContext(FileSearchContext);
  const { name } = useContext(UserContext).user;
  const { selected, project } = searchFileProps;
  const { expanded, handleExpanChange } = params;

  const [options, setOptions] = useState({
    ecuVersion: "R7_31_70D6_00",
    versionOptions: ["R7_31_70D6_00", "R7_31_70D6_01"],
    ecu: {
      ECU_DO_PPAR: false,
      ECU_DO_NVM: false
    },
    sensor: {
      USE_SENSOR_10: true,
      USE_SENSOR_11: false,
      USE_SENSOR_12: true,
      USE_SENSOR_30: false,
      USE_SENSOR_32: false
    },
    outputLocation: "D:\\HIL_out",
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
    handleChange("ecuVersion", event.target.value);

  const handleSubmitTasks = () => {
    const url = `${api_server}/tasks/${taskName}/new`;
    const { ecuVersion, ecu, sensor, outputLocation } = options;
    Axios.post(url, {
      ecuVersion,
      project,
      ecu,
      sensor,
      outputLocation,
      requestedBy: name,
      fileIDs: selected
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
            <InputLabel htmlFor="ecuVersion-select">ECU Version</InputLabel>
            <Select
              value={options.ecuVersion}
              onChange={handleVersionChange}
              inputProps={{
                name: "ecuVersion",
                id: "ecuVersion-select"
              }}
            >
              {options.versionOptions.map(ev => (
                <MenuItem key={`sv-${ev}`} value={ev}>
                  {ev}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            error={!options.simsLocationValid}
            fullWidth
            required
            id="new-root-path"
            label="Output Location"
            value={options.outputLocation}
            onChange={event =>
              handleChange("outputLocation", event.target.value)
            }
            margin="dense"
            helperText={options.simsLocationHelperText}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              paddingTop: "1rem"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <FormLabel component="legend">ECU Options</FormLabel>
              <FormGroup>
                {Object.keys(options.ecu).map(key => (
                  <FormControlLabel
                    key={uuid()}
                    control={
                      <Checkbox
                        color="primary"
                        checked={options.ecu[key]}
                        onChange={event =>
                          setOptions({
                            ...options,
                            ecu: { ...options.ecu, [key]: !options.ecu[key] }
                          })
                        }
                      />
                    }
                    label={key}
                  />
                ))}
              </FormGroup>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column"
              }}
            >
              <FormLabel component="legend">Sensor Options</FormLabel>
              <FormGroup>
                {Object.keys(options.sensor).map(_key => (
                  <FormControlLabel
                    key={uuid()}
                    control={
                      <Checkbox
                        color="primary"
                        checked={options.sensor[_key]}
                        onChange={event =>
                          setOptions({
                            ...options,
                            sensor: {
                              ...options.sensor,
                              [_key]: !options.sensor[_key]
                            }
                          })
                        }
                      />
                    }
                    label={_key}
                  />
                ))}
              </FormGroup>
            </div>
          </div>
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
