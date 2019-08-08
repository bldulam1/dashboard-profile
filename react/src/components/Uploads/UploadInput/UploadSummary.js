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
import { normalizeSize } from "../../Search";

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
  const { uploadProps } = React.useContext(UploadContext);
  const {
    method,
    uploadMethods,
    files,
    ncDetails,
    storageLocation,
    tags,
    preUploadOperations
  } = uploadProps;
  const classes = useStyles();
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const cleanedPreUploadOps = () => {
    const ops = [];

    for (const key in preUploadOperations) {
      if (preUploadOperations[key].value) {
        ops.push(key);
      }
    }
    return ops;
  };

  const cleanedTags = () => {
    return tags
      .filter(tag => tag.value.length)
      .map(tag => `${tag.key}:${tag.value}`);
  };

  const handleUpload = () => {
    console.log(uploadProps);
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
            `${files.length} files, ${normalizeSize(totalSize)} total`
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
          color={files.length ? "primary" : "default"}
          variant="contained"
          disabled={!files.length}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </section>
    </div>
  );
};
