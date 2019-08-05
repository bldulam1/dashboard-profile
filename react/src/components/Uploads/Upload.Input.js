import React from "react";
import { useDropzone } from "react-dropzone";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import MetaData from "./UploadInput/MetaData";
import NamingConvention from "./UploadInput/NamingConvention";
import UploadSummary from "./UploadInput/UploadSummary";
import StorageLocation from "./UploadInput/StorageLocation";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { UploadContext } from "../../context/Upload.Context";
// import CustomDropzone from "./Dropzone/CustomDropzone";
import axios from "axios";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%"
  },
  paper: {
    height: "100%",
    width: "100%"
  },
  control: {
    padding: theme.spacing(2)
  },

  mainGrid: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },

  dropZoneOuter: {
    backgroundColor: "#707070",
    color: "white",
    width: "90%",
    height: "90%",
    margin: "auto",
    textAlign: "center",
    borderRadius: "1rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    cursor: "pointer"
  },
  dropZoneInner: {
    margin: "auto",
    width: "95%",
    height: "95%",
    border: "1px solid #E0C1CB",
    borderRadius: "0.95rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column"
  },
  formControl: {
    width: "100%"
  },
  tabPanel: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    position: "relative",
    minHeight: 200
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  }
}));

function UploadFile({ lastModifiedDate, name, size }) {
  const splits = name.split(".");
  return {
    name,
    lastModifiedDate,
    size,
    type: splits[splits.length - 1],
    progress: 0
  };
}

function UploadExpansionPanelObject(heading, details, detailStyle) {
  return { heading, detailStyle, details };
}

export default params => {
  const classes = useStyles();
  const { setFiles, updateFileUploadPercentage } = React.useContext(
    UploadContext
  );
  const [expanded, setExpanded] = React.useState("panel-0");

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onDrop = React.useCallback(selectedFiles => {
    let formattedFiles = selectedFiles.map(sf => UploadFile(sf));
    setFiles(formattedFiles);
    selectedFiles.forEach((sf, sfIndex) => {
      const data = new FormData();
      data.append("file", sf);
      axios.post("http://localhost:8000/upload/Nissan", data, {
        onUploadProgress: ProgressEvent => {
          formattedFiles[sfIndex].progress =
            ProgressEvent.loaded / ProgressEvent.total;
          setFiles([...formattedFiles]);
        }
      });
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const dropZone = (
    <Card className={classes.dropZoneOuter}>
      <div className={classes.dropZoneInner} {...getRootProps({})}>
        <input
          {...getInputProps({
            onDrop: event => console.log(event)
          })}
        />
        <Typography variant="h6">
          {isDragActive
            ? "Drop the files here"
            : "Drop some files here, or click to select files"}
        </Typography>
      </div>
    </Card>
  );

  const expansionPanels = [
    UploadExpansionPanelObject("File Selection", dropZone, { height: "50vh" }),
    UploadExpansionPanelObject("Naming Convention", <NamingConvention />),
    UploadExpansionPanelObject("Meta Data Label", <MetaData />),
    UploadExpansionPanelObject("Storage Location", <StorageLocation />),
    UploadExpansionPanelObject(
      "Pre-upload Operations",
      <div>
        <FormControlLabel control={<Checkbox />} label="AMP Check" />
        <FormControlLabel control={<Checkbox />} label="Messie Check" />
      </div>
    ),
    UploadExpansionPanelObject("Upload Summary", <UploadSummary />)
  ];
  return (
    <Grid item xs={12} md={6} className={classes.mainGrid}>
      <Typography variant="h6" color="primary">
        Upload Input
      </Typography>

      <div className={classes.root}>
        {expansionPanels.map(
          ({ heading, detailStyle, details }, panelIndex) => (
            <UploadExpansionPanel
              key={`panel-${panelIndex}`}
              panelName={`panel-${panelIndex}`}
              expanded={expanded}
              handleChange={handleChange}
              heading={heading}
              detailStyle={detailStyle}
              details={details}
            />
          )
        )}
      </div>
    </Grid>
  );
};

function UploadExpansionPanel(params) {
  const classes = useStyles();
  const {
    panelName,
    expanded,
    handleChange,
    heading,
    secondaryHeading,
    details,
    detailStyle
  } = params;

  return (
    <ExpansionPanel
      expanded={expanded === panelName}
      onChange={handleChange(panelName)}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={panelName + "-content"}
        id={panelName + "-header"}
      >
        <Typography className={classes.heading}>{heading}</Typography>
        {secondaryHeading && (
          <Typography className={classes.secondaryHeading}>
            {secondaryHeading}
          </Typography>
        )}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        style={{ display: "flex", flexDirection: "column", ...detailStyle }}
      >
        {details}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
