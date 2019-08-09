import React from "react";
import Button from "@material-ui/core/Button";
import { UploadContext } from "../../../context/Upload.Context";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DescriptionIcon from "@material-ui/icons/Description";
import LabelIcon from "@material-ui/icons/Label";
import GavelIcon from "@material-ui/icons/Gavel";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import ListAltIcon from "@material-ui/icons/ListAlt";
import SettingsIcon from "@material-ui/icons/Settings";
import Tooltip from "@material-ui/core/Tooltip";
import { normalizeSize } from "../../../util/strings";
import Axios from "axios";
import { api_server } from "../../../environment/environment";
import { ProjectContext } from "../../../context/Project.Context";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
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
  const { activeProject } = React.useContext(ProjectContext);
  const {
    method,
    uploadMethods,
    files,
    ncDetails,
    storageLocation,
    sourceDirectory,
    tags,
    preUploadOperations,
    selectedDropFiles
  } = uploadProps;
  const classes = useStyles();
  const validFiles = files.filter(file => file.progress >= 0);
  const totalSize = validFiles.reduce((acc, file) => acc + file.size, 0);
  const cleanedPreUploadOps = () => {
    const ops = [];

    for (const key in preUploadOperations) {
      if (preUploadOperations[key].value) {
        const {parameters} = preUploadOperations[key];
        ops.push(`${key}  ${JSON.stringify(parameters)}`);
      }
    }
    return ops;
  };

  const cleanedTags = () => {
    return tags
      .filter(tag => tag.value.length)
      .map(tag => `${tag.key}:${tag.value}`);
  };

  const normalUpload = () => {
    const validFilesNames = validFiles.map(vf => vf.name);
    let formattedFiles = files;
    const batches = [0, 1, 2, 3, 4];
    const submitFile = async (sdf, sfIndex) => {
      const data = new FormData();
      data.append("file", sdf);
      data.append("storageLocation", storageLocation);
      data.append("tags", tags);
      data.append("preUploadOperations", cleanedPreUploadOps());
      const res = await Axios.post(
        `${api_server}/upload/${activeProject}`,
        data,
        {
          onUploadProgress: ProgressEvent => {
            formattedFiles[sfIndex].progress =
              ProgressEvent.loaded / ProgressEvent.total;
            uploadDispatch({
              files: [...formattedFiles],
              type: "Files"
            });
          }
        }
      );
      return res;
    };

    batches.forEach(async batch => {
      for (
        let sfIndex = batch;
        sfIndex < selectedDropFiles.length;
        sfIndex += batches.length
      ) {
        const sdf = selectedDropFiles[sfIndex];
        if (validFilesNames.includes(sdf.name)) {
          let maxTries = 5;
          let isSubmitted = false;
          while (maxTries > 0 && !isSubmitted) {
            const res = await submitFile(sdf, sfIndex);
            isSubmitted = res.status === 200;
            console.log({ isSubmitted });
            maxTries--;
          }
        }
      }
    });
  };

  const vdriveUpload = async () => {
    const url = `${api_server}/upload/v-drive/${activeProject}`;

    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const file = files[fileIndex];
      if (file.progress < 0) continue;
      const {
        data: { progress, issue }
      } = await Axios.post(url, {
        file,
        storageLocation,
        sourceDirectory
      });

      const newFiles = files;
      newFiles[fileIndex] = { ...newFiles[fileIndex], progress, issue };
      uploadDispatch({
        type: "Files",
        files: newFiles
      });
    }
  };

  const handleUpload = async () => {
    switch (method) {
      case 1:
        return vdriveUpload();
      default:
        return normalUpload();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <section>
        <List className={classes.root}>
          {SummaryItem(
            <SettingsIcon />,
            "Upload Method",
            uploadMethods[method]
          )}
          {SummaryItem(
            <DescriptionIcon />,
            "Files Count",
            `${validFiles.length} files, ${normalizeSize(totalSize)} total`
          )}
          {SummaryItem(
            <GavelIcon />,
            "Naming Convention",
            ncDetails.name && ncDetails.name.length ? ncDetails.name : "null"
          )}
          {SummaryItem(
            <LabelIcon />,
            "Meta Data Label",
            cleanedTags().length ? cleanedTags() : "null"
          )}
          {SummaryItem(<LocationOnIcon />, "Storage Location", storageLocation)}
          {SummaryItem(
            <ListAltIcon />,
            "PreUpload Operations",
            cleanedPreUploadOps().length ? cleanedPreUploadOps() : "null"
          )}
        </List>
      </section>

      <section style={{ alignSelf: "flex-end" }}>
        <Button color="secondary" variant="contained">
          Cancel
        </Button>
        <Button
          color={validFiles.length ? "primary" : "default"}
          variant="contained"
          disabled={!validFiles.length}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </section>
    </div>
  );
};
