import React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import UploadInput from "./Upload.Input";
import UploadStatus from "./Upload.Status";
import { ProjectContext } from "../../context/Project.Context";
import { UploadContext } from "../../context/Upload.Context";

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

// function getTimeStamp() {
//   const newTime = new Date();
//   return {
//     year: newTime.getFullYear(),
//     month: newTime.getMonth(),
//     day: newTime.getDate(),
//     minute: newTime.getMinutes(),
//     hour: newTime.getHours(),
//     second: newTime.getSeconds()
//   };
// }

export default props => {
  const classes = useStyles();
  const { activeProject } = React.useContext(ProjectContext);

  const [files, setFiles] = React.useState([]);
  const [tags, setTags] = React.useState([{ key: keyOptions[0], value: "" }]);
  const [
    selectedNamingConvention,
    setSelectedNamingConvention
  ] = React.useState("");
  const [ncDetails, setNCDetails] = React.useState({});

  const rootPath = "V:\\JP01\\DataLake";
  const [storageLocation, setStorageLocation] = React.useState(
    `${rootPath}\\Valpro\\${activeProject}\\username\\`
  );

  return (
    <Paper className={classes.contentPaper}>
      <Grid container spacing={3} className={classes.container}>
        <UploadContext.Provider
          value={{
            files,
            setFiles,
            keyOptions,
            tags,
            setTags,
            selectedNamingConvention,
            setSelectedNamingConvention,
            ncDetails,
            setNCDetails,
            rootPath,
            storageLocation,
            setStorageLocation
          }}
        >
          <UploadStatus files={files} setFiles={setFiles} />
          <UploadInput />
        </UploadContext.Provider>
      </Grid>
    </Paper>
  );
};
