import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import UploadInput from "./Upload.Input";
import UploadStatus from "./Upload.Status";

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

function File(name, progress) {
  const splits = name.split(".");
  const type = splits[splits.length - 1];
  return { name, type, progress };
}

export const UploadContext = React.createContext(null);

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
        <UploadContext.Provider value={{ files, setFiles }}>
          <UploadStatus />
          <UploadInput />
        </UploadContext.Provider>
      </Grid>
    </Paper>
  );
};
