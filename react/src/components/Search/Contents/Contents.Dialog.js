import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import CalendarToday from "@material-ui/icons/CalendarToday";
import MyLocation from "@material-ui/icons/MyLocation";
import LabelIcon from "@material-ui/icons/Label";
import LabelImportant from "@material-ui/icons/LabelImportant";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import DateRange from "@material-ui/icons/DateRange";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  breakWord: {
    wordWrap: "break-word"
  }
}));

function EnhancedListItem(params) {
  const { icon, primaryText, secondaryText, nested } = params;
  const classes = useStyles();

  return (
    <ListItem className={`${nested && classes.nested}`}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText
        primary={primaryText}
        secondary={
          <Typography
            component="div"
            variant="caption"
            color="textPrimary"
            className={classes.breakWord}
          >
            {secondaryText}
          </Typography>
        }
      />
    </ListItem>
  );
}

export default params => {
  const classes = useStyles();
  const { open, toggleDialog, fileDetails } = params;
  // const [datesOpen, toggleDatesOpen] = useToggle(false);
  // const [operationsOpen, toggleOperationsOpen] = useToggle(false);
  // const [tagsOpen, toggleOpen] = useToggle(false);

  const [propsOpen, setPropsOpen] = useState({
    dates: false,
    operations: false,
    tags: false
  });

  const togglePropsOpen = prop => {
    setPropsOpen({
      ...propsOpen,
      [prop]: !propsOpen[prop]
    });
  };

  const { fileName, path, date, operations, tags } = fileDetails;
  const modified = date && date.modified;
  const birth = date && date.birth;
  const mapped = date && date.mapped;

  return (
    <Dialog
      fullWidth={true}
      maxWidth="md"
      open={open}
      onClose={toggleDialog}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="max-width-dialog-title">File Details</DialogTitle>
      <DialogContent>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          className={classes.root}
        >
          <EnhancedListItem
            icon={<MyLocation />}
            primaryText={fileName}
            secondaryText={path}
          />
          <ListItem button onClick={() => togglePropsOpen("dates")}>
            <ListItemIcon>
              <CalendarToday />
            </ListItemIcon>
            <ListItemText primary="Dates" />
            {propsOpen.dates ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={propsOpen.dates} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <EnhancedListItem
                icon={<DateRange />}
                primaryText={new Date(modified).toString()}
                secondaryText="Last modified"
                nested={true}
              />
              <EnhancedListItem
                icon={<DateRange />}
                primaryText={new Date(birth).toString()}
                secondaryText="Date created"
                nested={true}
              />
              <EnhancedListItem
                icon={<DateRange />}
                primaryText={new Date(mapped).toString()}
                secondaryText="Last mapped"
                nested={true}
              />
            </List>
          </Collapse>

          <ListItem button onClick={() => togglePropsOpen("tags")}>
            <ListItemIcon>
              <LabelIcon />
            </ListItemIcon>
            <ListItemText primary="Tags" />
            {propsOpen.tags ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={propsOpen.tags} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <EnhancedListItem
                icon={<LabelImportant />}
                primaryText="Test"
                secondaryText="Value"
                nested={true}
              />
            </List>
          </Collapse>

          <ListItem button onClick={() => togglePropsOpen("operations")}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Operations" />
            {propsOpen.operations ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={propsOpen.operations} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <EnhancedListItem
                icon={<AssignmentIcon />}
                primaryText="Test"
                secondaryText="Value"
                nested={true}
              />
            </List>
          </Collapse>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggleDialog} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
