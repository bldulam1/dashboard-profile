import { useDropzone } from "react-dropzone";
import React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { UploadContext } from "../../../context/Upload.Context";
import { makeStyles } from "@material-ui/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Axios from "axios";
import { api_server } from "../../../environment/environment";
import { normalizeSize } from "../../../util/strings";
import DescriptionIcon from "@material-ui/icons/Description";
import MemoryIcon from "@material-ui/icons/Memory";
import { UploadFile, isFollowingNamingConvention } from "../../../util/files";
import { numberWithCommas } from "../../../util/strings";

var debounceTimer;
const UPLOAD_ROOT = "V:\\JP01\\DataLake\\Common_Write\\";

const useStyles = makeStyles(theme => ({
  dropZoneOuter: {
    backgroundColor: "#707070",
    color: "white",
    width: "90%",
    height: "90%",
    margin: "1rem auto",
    textAlign: "center",
    borderRadius: "1rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    cursor: "pointer"
  },
  dropZoneInner: {
    margin: "auto",
    padding: '1%',
    width: "95%",
    height: "95%",
    border: "1px solid #E0C1CB",
    borderRadius: "0.95rem",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column"
  }
}));
function SummaryItem(icon, title, content) {
  return (
    <Tooltip placement="left-start" title={title}>
      <ListItem>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={content} />
      </ListItem>
    </Tooltip>
  );
}

export default () => {
  const { uploadProps, uploadDispatch } = React.useContext(UploadContext);
  const { method, uploadMethods } = uploadProps;

  function handleUploadMethod(event, method) {
    uploadDispatch({
      method: method,
      type: "UploadMethod",
      files: []
    });
  }
  return (
    <>
      <Tabs
        centered
        value={uploadProps.method}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleUploadMethod}
        aria-label="disabled tabs example"
      >
        {uploadMethods.map((label, umI) => (
          <Tab key={"um-" + umI} label={label} value={umI} />
        ))}
      </Tabs>

      {method ? <VDriveUpload /> : <NormalUpload />}
    </>
  );
};

function NormalUpload() {
  const { uploadProps, uploadDispatch } = React.useContext(UploadContext);
  const { ncDetails } = uploadProps;
  const classes = useStyles();
  const onDrop = React.useCallback(
    selectedFiles => {
      uploadDispatch({
        type: 'DropFiles',
        selectedDropFiles: selectedFiles
      });

      let formattedFiles = selectedFiles.map(sf => UploadFile(sf));
      if (ncDetails.elements) {
        formattedFiles = formattedFiles.map(file => ({
          ...file,
          ...isFollowingNamingConvention(file, ncDetails)
        }));
      }

      uploadDispatch({
        files: formattedFiles,
        type: "Files"
      });

    },
    [ncDetails, uploadDispatch]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
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
}

function VDriveUpload() {
  const { uploadProps, uploadDispatch } = React.useContext(UploadContext);
  const { isSourceDirectoryExists, sourceDirectory, files } = uploadProps;
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  const fetchData = async dir => {
    if (dir === UPLOAD_ROOT) {
      return;
    }

    const url = `${api_server}/fs/read-dir/${dir}`;
    const res = await Axios.get(url);
    const { files } = res.data;
    uploadDispatch({
      type: "Files",
      files
    });
  };
  const handleSDChange = async event => {
    clearTimeout(debounceTimer);
    const newDir = event.target.value;

    if (event.target.value === UPLOAD_ROOT) {
      return;
    }
    uploadDispatch({
      type: "VDriveSourceDirectory",
      sourceDirectory: newDir
    });

    debounceTimer = setTimeout(async () => {
      const url = `${api_server}/fs/is-directory-exist/${newDir}`;
      const { data } = await Axios.get(url);
      uploadDispatch({
        type: "SourceDirectoryExists",
        isSourceDirectoryExists: data
      });

      data
        ? fetchData(newDir)
        : uploadDispatch({
            type: "Files",
            files: []
          });
    }, 1000);
  };

  return (
    <div>
      <TextField
        error={!isSourceDirectoryExists}
        id="source"
        label={
          isSourceDirectoryExists
            ? "Source Directory"
            : "Location cannot be accessed"
        }
        defaultValue={sourceDirectory}
        margin="normal"
        fullWidth
        onChange={handleSDChange}
      />
      <List>
        {SummaryItem(
          <DescriptionIcon />,
          "Files Count",
          `${numberWithCommas(files.length)} files`
        )}
        {SummaryItem(<MemoryIcon />, "Total Size", normalizeSize(totalSize))}
      </List>
    </div>
  );
}
