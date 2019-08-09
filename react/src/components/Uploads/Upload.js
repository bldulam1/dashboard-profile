import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import UploadInput from "./Upload.Input";
import UploadStatus from "./Upload.Status";
import { ProjectContext } from "../../context/Project.Context";
import { UploadContext } from "../../context/Upload.Context";
import Axios from "axios";
import { api_server } from "../../environment/environment";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    height: "100%",
    margin: "auto"
  },
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    width: "100%"
  }
}));

const group1 = [
  "Target Vehicle 1",
  "Target Vehicle 2",
  "Target Vehicle 3",
  "Weather",
  "Recording Location"
].sort();
const group2 = ["PLM", "PTC", "DOORS", "JIRA", "Sharepoint"].sort();
const keyOptions = [...group1, ...group2];


function reducer(state, action) {
  const {
    type,
    selectedDropFiles,
    files,
    method,
    sourceDirectory,
    isSourceDirectoryExists,
    namingConventions,
    selectedNC,
    ncDetails,
    tags,
    storageLocation,
    preUploadOperations
  } = action;

  switch (type) {
    case "DropFiles":
      return { ...state, selectedDropFiles };
    case "Files":
      return { ...state, files };
    case "UploadMethod":
      return { ...state, method, files };
    case "SourceDirectoryExists":
      return { ...state, isSourceDirectoryExists };
    case "VDriveSourceDirectory":
      return { ...state, sourceDirectory };
    case "CountSize":
      return { ...state, files };
    case "NamingConventions":
      return { ...state, namingConventions };
    case "SelectedNamingConvention":
      return { ...state, selectedNC, ncDetails, files };
    case "StorageLocation":
      return { ...state, storageLocation };
    case "Tags":
      return { ...state, tags };
    case "PreUploadOperations":
      return { ...state, preUploadOperations };
    default:
      return state;
  }
}
export default props => {
  const { activeProject } = React.useContext(ProjectContext);
  const classes = useStyles();

  const [uploadProps, uploadDispatch] = React.useReducer(reducer, {
    selectedDropFiles: [],
    files: [],
    uploadMethods: ["Normal Upload", "V-Drive Upload"],
    method: 0,
    sourceDirectory: `V:\\JP01\\DataLake\\Common_Write\\${activeProject}`,
    isSourceDirectoryExists: true,
    namingConventions: [],
    selectedNC: "",
    ncDetails: {},
    rootPath: "V:\\JP01\\DataLake",
    storageLocation: `V:\\JP01\\DataLake\\Valpro\\${activeProject}\\`,
    keyOptions,
    tags: [{ key: keyOptions[0], value: "" }],
    preUploadOperations: {
      ampCheck: {
        value: false,
        disabled: false,
        parameters: {
          threshold: 99,
          minimumFrame: 500
        }
      },
      messieCheck: {
        value: false,
        disabled: true,
        parameters: {}
      }
    }
  });

  React.useEffect(() => {
    const url = `${api_server}/naming-convention/distinct/${activeProject}/names`;
    Axios.get(url).then(res => {
      uploadDispatch({
        type: "NamingConventions",
        namingConventions: res.data,
        selectedNC: res.data.length ? res.data[0]._id : ""
      });
    });
  }, [activeProject]);

  return (
    <Paper className={classes.contentPaper}>
      <Grid container spacing={3} className={classes.container}>
        <UploadContext.Provider
          value={{
            uploadProps,
            uploadDispatch
          }}
        >
          <UploadStatus />
          <UploadInput />
        </UploadContext.Provider>
      </Grid>
    </Paper>
  );
};
