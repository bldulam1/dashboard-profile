import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import MetaData from "./UploadInput/MetaData";
import NamingConvention from "./UploadInput/NamingConvention";
import UploadSummary from "./UploadInput/UploadSummary";
import StorageLocation from "./UploadInput/StorageLocation";

import FileSelection from "./UploadInput/FileSelection";
import PreUploadOperations from "./UploadInput/PreUploadOperations";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%"
  },
  mainGrid: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
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

function UploadExpansionPanelObject(heading, details, detailStyle) {
  return { heading, detailStyle, details };
}

export default params => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState("panel-0");

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const expansionPanels = [
    UploadExpansionPanelObject("File Selection", <FileSelection />, {
      height: "45vh"
    }),
    UploadExpansionPanelObject("Naming Convention", <NamingConvention />),
    UploadExpansionPanelObject("Meta Data Label", <MetaData />),
    UploadExpansionPanelObject("Storage Location", <StorageLocation />),
    UploadExpansionPanelObject("PreUpload Operations", <PreUploadOperations />),
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
