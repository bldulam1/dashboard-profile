import React, { useContext, useState } from "react";
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
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import { useTheme } from "@material-ui/styles";

import fileDownload from "js-file-download";
import { json2csv } from "../../../../util/my-library";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

export default params => {
  const taskName = "Export List";
  const { searchFileProps } = useContext(FileSearchContext);
  const { name } = useContext(UserContext);
  const { selected, project } = searchFileProps;
  const { expanded, handleExpanChange } = params;
  const theme = useTheme();

  const [options, setOptions] = useState({
    selectedFileInfo: ["Full Filename"],
    fileInfoOptions: [
      "File Name",
      "Full Filename",
      "Path",
      "extension",
      "size",
      "tags",
      "operations"
    ],
    output: "csv",
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
    const { selectedFileInfo } = options;
    Axios.post(url, {
      project,
      fileIDs: selected,
      requestedBy: name,
      selectedFileInfo
    })
      .then(results => {
        switch (options.output) {
          case "txt":
            return fileDownload(json2csv(results.data), "fileList.txt");
          case "csv":
            return fileDownload(json2csv(results.data), "fileList.csv");
          case "json":
            return fileDownload(JSON.stringify(results.data), "fileList.json");
          default:
            break;
        }
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
    return Boolean(
      selected.length &&
        !options.invalidFiles.length &&
        options.selectedFileInfo.length
    );
  };

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
          {getSubHeadingText([], selected)}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
        <form noValidate autoComplete="off">
          <FormControl fullWidth className={classes.formControl}>
            <InputLabel htmlFor="select-fileInfo-chip">
              Select File Info
            </InputLabel>
            <Select
              fullWidth
              multiple
              value={options.selectedFileInfo}
              onChange={event =>
                handleChange("selectedFileInfo", event.target.value)
              }
              input={<Input id="select-fileInfo-chip" />}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map(value => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {options.fileInfoOptions.map(name => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, options.selectedFileInfo, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth className={classes.formControl}>
            <InputLabel htmlFor="output-simple">Output</InputLabel>
            <Select
              value={options.output}
              fullWidth
              onChange={event => handleChange("output", event.target.value)}
              inputProps={{
                name: "output",
                id: "output-simple"
              }}
            >
              <MenuItem value={"txt"}>Text File</MenuItem>
              <MenuItem value={"csv"}>CSV File</MenuItem>
              <MenuItem value={"json"}>JSON File</MenuItem>
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
