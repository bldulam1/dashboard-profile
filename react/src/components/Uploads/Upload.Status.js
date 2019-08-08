import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import LinearProgress from "@material-ui/core/LinearProgress";
import Tooltip from "@material-ui/core/Tooltip";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from "@material-ui/icons/Delete";
import Tabs from "@material-ui/core/Tabs";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import uuid from "uuid";
import Tab from "@material-ui/core/Tab";
import { makeStyles } from "@material-ui/core/styles";
import { UploadContext } from "../../context/Upload.Context";

const useStyles = makeStyles(theme => ({
  mainGrid: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  squareAvatar: {
    background: `linear-gradient(to right bottom, ${
      theme.palette.primary.light
    },${theme.palette.primary.dark} )`
  }
}));

export default () => {
  const { uploadProps, uploadDispatch } = React.useContext(UploadContext);
  const { files } = uploadProps;

  const classes = useStyles();
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

  const handleCancelFile = filename => {
    uploadDispatch({
      type: "Files",
      files: files.filter(({ name }) => name !== filename)
    })
  };

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
            label={`${s.display} (${
              files.filter(file => getStatusValue(file.progress) === s.value)
                .length
            })`}
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
                  disableTypography
                  primary={
                    <Typography variant="subtitle2">{file.name}</Typography>
                  }
                  secondary={
                    <LinearProgress
                      variant="determinate"
                      value={100 * file.progress}
                    />
                  }
                />
                {!activeStatus && (
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleCancelFile(file.name)}
                    >
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
};

function Status(display, name, value, disabled) {
  return { display, name, value, disabled };
}

function getStatusValue(progress) {
  if (progress === 0) return 0;
  else if (progress < 1 && progress > 0) return 1;
  else if (progress === 1) return 2;
  return 3;
}
