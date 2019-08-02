import React from "react";
import { useDropzone } from "react-dropzone";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";

import uuid from "uuid";

import { green } from "@material-ui/core/colors";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MetaData from "./UploadInput/MetaData";
import NamingConvention from "./UploadInput/NamingConvention";
import UploadSummary from "./UploadInput/UploadSummary";
import StorageLocation from "./UploadInput/StorageLocation";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { UploadContext } from "../../context/Upload.Context";
import CustomDropzone from "./Dropzone/CustomDropzone";

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
  container: {
    width: "100%",
    height: "100%",
    margin: "auto"
  },
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    width: "100%"
  },
  uploadStatus: {
    display: "flex",
    flexDirection: "column"
  },
  mainGrid: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  squareAvatar: {
    background: `linear-gradient(to right bottom, ${
      theme.palette.primary.light
    },${theme.palette.primary.dark} )`
  },
  dropZoneOuter: {
    backgroundColor: "#707070",
    color: "white",
    width: "70%",
    height: "50%",
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
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  fabGreen: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[600]
    }
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

export default params => {
  const classes = useStyles();
  const { files, setFiles } = React.useContext(UploadContext);
  const onDrop = React.useCallback(selectedFiles => {
    setFiles([...files, ...selectedFiles.map(sf => UploadFile(sf))]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Grid item xs={12} md={6} className={classes.mainGrid}>
      <Typography variant="h6" color="primary">
        Upload Input
      </Typography>

      <CustomDropzone />

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

      <FloatingActionButtonZoom style={{ margin: "auto" }} />
    </Grid>
  );
};

function FloatingActionButtonZoom() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleChangeIndex(index) {
    setValue(index);
  }

  const components = [
    UploadComponent("Meta Data Label", <MetaData />),
    UploadComponent("Naming Convention", <NamingConvention />),
    UploadComponent("Storage Location", <StorageLocation />),
    UploadComponent(
      "Pre-upload Operations",
      <div>
        <FormControlLabel control={<Checkbox />} label="AMP Check" />
        <FormControlLabel control={<Checkbox />} label="Messie Check" />
      </div>
    ),
    UploadComponent("Upload", <UploadSummary />)
  ];

  // const transitionDuration = {
  //   enter: theme.transitions.duration.enteringScreen,
  //   exit: theme.transitions.duration.leavingScreen
  // };

  // const fabs = [
  //   {
  //     color: "primary",
  //     className: classes.fab,
  //     icon: <AddIcon />,
  //     label: "Add"
  //   },
  //   {
  //     color: "secondary",
  //     className: classes.fab,
  //     icon: <EditIcon />,
  //     label: "Edit"
  //   },
  //   {
  //     color: "inherit",
  //     className: clsx(classes.fab, classes.fabGreen),
  //     icon: <UpIcon />,
  //     label: "Expand"
  //   }
  // ];

  return (
    <div className={classes.tabPanel}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="action tabs example"
        >
          {components.map((comp, index) => (
            <Tab key={uuid()} label={comp.name} {...a11yProps(index)} />
          ))}
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        {components.map((comp, index) => (
          <TabPanel
            key={uuid()}
            value={value}
            index={index}
            dir={theme.direction}
          >
            {comp.component}
          </TabPanel>
        ))}
      </SwipeableViews>
      {/* {fabs.map((fab, index) => (
        <Zoom
          key={fab.color}
          in={value === index}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${
              value === index ? transitionDuration.exit : 0
            }ms`
          }}
          unmountOnExit
        >
          <Fab
            aria-label={fab.label}
            className={fab.className}
            color={fab.color}
          >
            {fab.icon}
          </Fab>
        </Zoom>
      ))} */}
    </div>
  );
}
function UploadComponent(name, component) {
  return { name, component };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`action-tabpanel-${index}`}
      aria-labelledby={`action-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    "aria-controls": `action-tabpanel-${index}`
  };
}
