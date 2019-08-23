import React, { useContext } from "react";
import { FileSearchContext } from "../../../context/Search.Context";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { normalizeSize } from "../../../util/strings";
import { makeStyles } from "@material-ui/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(theme => ({
  avatar: {
    margin: "0.25rem",
    backgroundColor: theme.palette.secondary.dark
  },
  contentPaper: {
    margin: "1rem",
    padding: "1rem",
    width: "100%"
  },
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  infoCard: {
    width: "30%"
  },
  longText: {
    wordWrap: "break-word"
  }
}));

function Info(props) {
  const { longText } = useStyles();
  const { content, keyName } = props;
  return (
    <Typography
      component="div"
      variant="caption"
      className={longText}
      color="textPrimary"
    >
      <b style={{ marginRight: "0.5rem" }}>{keyName}</b>
      {content}
    </Typography>
  );
}

function MainInfo(props) {
  const { isFocus, scene } = props;
  const { path, size, date } = scene;
  const { modified, birth, mapped } = date;
  return (
    <div>
      <Info content={path} keyName="Path" />
      <Info content={normalizeSize(size)} keyName="Size" />

      {isFocus && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexDirection: "row",
            alignItems: "stretch"
          }}
        >
          <Card style={{ width: "30%" }}>
            <CardContent>
              <Typography
                color="secondary"
                gutterBottom
                variant="h6"
                component="h2"
              >
                Dates
              </Typography>
              <Info
                content={new Date(mapped).toLocaleString()}
                keyName="Mapped"
              />
              <Info
                content={new Date(birth).toLocaleString()}
                keyName="Created"
              />
              <Info
                content={new Date(modified).toLocaleString()}
                keyName="Modified"
              />
            </CardContent>
          </Card>
          <Card style={{ width: "30%" }}>
            <CardContent>
              <Typography
                color="secondary"
                gutterBottom
                variant="h6"
                component="h2"
              >
                Tags
              </Typography>
            </CardContent>
          </Card>
          <Card style={{ width: "30%" }}>
            <CardContent>
              <Typography
                color="secondary"
                gutterBottom
                variant="h6"
                component="h2"
              >
                Test Catalog Data
              </Typography>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default () => {
  const classes = useStyles();
  const { searchFileProps, searchFileDispatch } = useContext(FileSearchContext);
  const { scenes, focusScene, selected } = searchFileProps;
  let debounceTimer = null;

  const isSelected = id => {
    return selected.includes(id);
  };

  const handleSceneMouseEnter = id => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchFileDispatch({ focusScene: id });
    }, 700);
  };

  const handleAvatarClick = id => {
    const newSelected = isSelected(id)
      ? selected.filter(s => s !== id)
      : [...selected, id];
    searchFileDispatch({ selected: newSelected });
  };

  return (
    <List dense className={classes.list}>
      {scenes.map(scene => {
        return (
          <ListItem
            key={scene._id}
            onMouseEnter={() => handleSceneMouseEnter(scene._id)}
            onMouseLeave={() => clearTimeout(debounceTimer)}
            onClick={() => handleAvatarClick(scene._id)}
          >
            <ListItemAvatar style={{ cursor: "pointer" }}>
              <Avatar className={classes.avatar}>
                {isSelected(scene._id) ? (
                  <IconButton
                    className={classes.iconButton}
                    aria-label="Search"
                  >
                    <CheckCircleIcon />
                  </IconButton>
                ) : (
                  scene.extension[0].toLocaleUpperCase()
                )}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              style={{ cursor: "pointer" }}
              disableTypography
              id={`t-${scene._id}`}
              primary={
                <Typography
                  noWrap
                  component="h6"
                  variant="h6"
                  color="textPrimary"
                >
                  {scene.fileName}
                </Typography>
              }
              secondary={
                <MainInfo scene={scene} isFocus={scene._id === focusScene} />
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
};
