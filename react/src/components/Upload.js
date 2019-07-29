import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/styles";
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
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";

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

  const files = [
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
  ];

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
              </ListItem>
            </Tooltip>
          ))}
      </List>
    </Grid>
  );
}

function UploadInput() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    namingConvention: true,
    ampCheck: false
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  const { namingConvention, ampCheck } = state;

  return (
    <Grid item xs={12} md={6} className={classes.mainGrid}>
      <Typography variant="h6" color="primary">
        Upload Input
      </Typography>
      <Card className={classes.dropZoneOuter} onClick={() => alert("Hello")}>
        <div className={classes.dropZoneInner}>
          <Typography variant="h3">DROP</Typography>
          <Typography variant="h2">YOUR FILES</Typography>
          <Typography variant="h3">HERE</Typography>

          <Typography
            variant="h6"
            style={{ marginTop: "3rem" }}
            color="textPrimary"
          >
            OR CLICK TO NAVIGATE
          </Typography>
        </div>
      </Card>

      <div>
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
      </div>

      {namingConvention && (
        <NamingConvention style={{ marginBottom: "1rem" }} />
      )}

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
        <InputLabel htmlFor="age-simple">Naming Convention</InputLabel>
        <Select
          value={selectedNamingConvention}
          onChange={handleChange}
          inputProps={{
            name: "age",
            id: "age-simple"
          }}
        >
          {namingConventions.map(nc => (
            <MenuItem value={nc.name}>{nc.name}</MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {" "}
          Sample: {sampleNamingConvention(namingConventions[0])}
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
