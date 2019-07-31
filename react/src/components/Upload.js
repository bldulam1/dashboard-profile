import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import LinearProgress from "@material-ui/core/LinearProgress";
import Tooltip from "@material-ui/core/Tooltip";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import { useDropzone } from "react-dropzone";

import PropTypes from 'prop-types';
import clsx from 'clsx';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import { green } from '@material-ui/core/colors';
import Box from '@material-ui/core/Box';

import uuid from "uuid";



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
    flexDirection: "column",
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
    width: '100%',
    position: 'relative',
    minHeight: 200,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabGreen: {
    color: theme.palette.common.white,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[600],
    },
  }
}));

function Status(display, name, value, disabled) {
  return { display, name, value, disabled };
}

function File(name, progress) {
  const splits = name.split(".");
  const type = splits[splits.length - 1];
  return { name, type, progress };
}

function getStatusValue(progress) {
  if (progress === 0) return 0;
  else if (progress < 1 && progress > 0) return 1;
  else if (progress === 1) return 2;
  return 3;
}

export default props => {
  const classes = useStyles();
  const [files, setFiles] = React.useState([
    File("asdfasdf.cvw", 0.53),
    File("asdfasdf.cvw", 0),
    File("asdfasdf.dat", 0.4),
    File("asdfasdf.cvw", 0.96),
    File("asdfasdf.cvw", 1),
    File("asdfasdf.cvw", 1),
    File("asdfasdf.cvw", 0),
    File("asdfasdf.dat", 0),
    File("asdfasdf.cvw", 0.3),
    File("asdfasdf.cvw", -1)
  ]);

  return (
    <Paper className={classes.contentPaper}>
      <Grid container spacing={3} className={classes.container}>
        <UploadStatus files={files} />
        <UploadInput />
      </Grid>
    </Paper>
  );
};

function UploadStatus(props) {
  const classes = useStyles();
  const { files } = props;

  const status = [
    Status("pending", "pending", 0, false),
    Status("in progress", "in progress", 1, false),
    Status("completed", "completed", 2, false),
    Status("with issues", "with issues", 3, false)
  ];
  const [activeStatus, setActiveStatus] = React.useState(0);

  function handleChange(event, newValue) {
    setActiveStatus(newValue);
  }

  return (
    <Grid item xs={12} md={6} className={classes.mainGrid}>
      <Typography variant="h6" color="primary">
        Upload Status
      </Typography>
      <Tabs
        centered
        value={activeStatus}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="disabled tabs example"
      >
        {status.map(s => (
          <Tab
            key={`status-${s.value}`}
            label={s.display}
            disabled={s.disabled}
          />
        ))}
      </Tabs>
      <List>
        {files
          .filter(file => getStatusValue(file.progress) === activeStatus)
          .map(file => (
            <Tooltip
              key={uuid()}
              title={`${(100 * file.progress).toFixed(2)}%`}
              placement="right-end"
            >
              <ListItem>
                <ListItemAvatar>
                  <Avatar className={classes.squareAvatar}>
                    {file.type[0].toLocaleUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={file.name}
                  secondary={
                    <LinearProgress
                      variant="determinate"
                      value={100 * file.progress}
                    />
                  }
                />
                {!activeStatus && (
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            </Tooltip>
          ))}
      </List>
    </Grid>
  );
}

function MetaData() {
  return <div>Meta Data</div>;
}

function UploadInput() {
  const classes = useStyles();
  const [tags, setTags] = React.useState([]);
  const [state, setState] = React.useState({
    namingConvention: true,
    ampCheck: false,
    addMetaData: false,
    outputPath: false
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };
  const addNewTag = tag => setTags([...tags, tag]);

  const { namingConvention, ampCheck, outputPath, addMetaData } = state;
  const { getRootProps, getInputProps } = useDropzone();

  return (
    <Grid item xs={12} md={6} className={classes.mainGrid}>
      <Typography variant="h6" color="primary">
        Upload Input
      </Typography>

      <Card className={classes.dropZoneOuter}>
        <div className={classes.dropZoneInner} {...getRootProps()}>
          <input
            {...getInputProps({
              onDrop: event => console.log(event)
            })}
          />
          <Typography variant="h6">
            Drop some files here, or click to select files
          </Typography>
        </div>
      </Card>

      <FloatingActionButtonZoom style={{margin: 'auto'}}/>

      {/* <div>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Options</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={namingConvention}
                  onChange={handleChange("namingConvention")}
                  value="namingConvention"
                />
              }
              label="Follow Naming Convention"
            />
            {namingConvention && (
              <NamingConvention style={{ marginBottom: "1rem" }} />
            )}

            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={outputPath}
                  onChange={handleChange("outputPath")}
                  value="outputPath"
                />
              }
              label="Specify Storage Location"
            />
            {outputPath && <StorageLocation />}

            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={addMetaData}
                  onChange={handleChange("addMetaData")}
                  value="addMetaData"
                />
              }
              label="Add Meta Data"
            />
            {addMetaData && <MetaData addNewTag={addNewTag} />}

            <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                  checked={ampCheck}
                  onChange={handleChange("ampCheck")}
                  value="ampCheck"
                />
              }
              label="Perform AMP Check"
            />
          </FormGroup>
        </FormControl>
      </div> */}

      <section style={{ alignSelf: "flex-end" }}>
        <Button color="secondary" variant="contained">
          Cancel
        </Button>
        <Button color="primary" variant="contained">
          Upload
        </Button>
      </section>
    </Grid>
  );
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
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `action-tab-${index}`,
    'aria-controls': `action-tabpanel-${index}`,
  };
}


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

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const fabs = [
    {
      color: 'primary',
      className: classes.fab,
      icon: <AddIcon />,
      label: 'Add',
    },
    {
      color: 'secondary',
      className: classes.fab,
      icon: <EditIcon />,
      label: 'Edit',
    },
    {
      color: 'inherit',
      className: clsx(classes.fab, classes.fabGreen),
      icon: <UpIcon />,
      label: 'Expand',
    },
  ];

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
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
      </SwipeableViews>
      {fabs.map((fab, index) => (
        <Zoom
          key={fab.color}
          in={value === index}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${value === index ? transitionDuration.exit : 0}ms`,
          }}
          unmountOnExit
        >
          <Fab aria-label={fab.label} className={fab.className} color={fab.color}>
            {fab.icon}
          </Fab>
        </Zoom>
      ))}
    </div>
  );
}

function StorageLocation() {
  return (
    <TextField
      label="Storage Location"
      id="simple-start-adornment"
      // className={clsx(classes.margin, classes.textField)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">V:\JP01\DataLake\</InputAdornment>
        )
      }}
    />
  );
}

function NCElement(name, length, options) {
  return { name, length, options };
}

function NConvention(name, elements, separator) {
  return { name, elements, separator };
}

function sampleNamingConvention({ elements, separator }) {
  function fixedString(len) {
    let tempChar = "X";
    let retString = "";
    for (let index = 0; index < len; index++) {
      retString = retString + tempChar;
    }
    return retString;
  }

  return elements
    .map(elem =>
      elem.length
        ? fixedString(elem.length)
        : elem.options[Math.floor(elem.options.length * Math.random())]
    )
    .join(separator);
}

function NamingConvention() {
  const classes = useStyles();

  const namingConventions = [
    NConvention(
      "NC01",
      [
        NCElement("date", "8", null),
        NCElement("time", "6", null),
        NCElement("function", null, ["RC", "ASD"])
      ],
      "_"
    ),
    NConvention(
      "NC02",
      [
        NCElement("date", "8", null),
        NCElement("time", "6", null),
        NCElement("function", null, ["RC", "ASD"])
      ],
      "^"
    )
  ];

  const [
    selectedNamingConvention,
    setSelectedNamingConvention
  ] = React.useState("NC01");

  function handleChange(event) {
    setSelectedNamingConvention(event.target.value);
  }
  return (
    <React.Fragment>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="naming-convention">Naming Convention</InputLabel>
        <Select
          value={selectedNamingConvention}
          onChange={handleChange}
          inputProps={{
            name: "age",
            id: "naming-convention"
          }}
        >
          {namingConventions.map(nc => (
            <MenuItem key={"nc-" + nc.name} value={nc.name}>
              {nc.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          Sample: {sampleNamingConvention(namingConventions[1])}
        </FormHelperText>
      </FormControl>
      <div>
        <Button size="small" color="primary" variant="outlined">
          Create New
        </Button>
        <Button size="small" color="secondary" variant="outlined">
          Edit
        </Button>
      </div>
    </React.Fragment>
  );
}
