import React, { useState, useEffect } from "react";
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
// import MapIcon from "@material-ui/icons/Map";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import DateRange from "@material-ui/icons/DateRange";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import Axios from "axios";
import { api_server } from "../../../environment/environment";
// import ContentsMapView from "./Contents.MapView";

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

// function OperationListItem(params) {
//   const { icon, task, nested } = params;
//   console.log(task);
//   const { operation, status, requestedBy, assignedWorker } = task;
//   const classes = useStyles();

//   return (
//     <ListItem className={`${nested && classes.nested}`}>
//       <ListItemIcon>{icon}</ListItemIcon>
//       <ListItemText
//         primary={operation}
//         secondary={
//           <Fragment>
//             <Typography
//               component="div"
//               variant="caption"
//               color="textPrimary"
//               className={classes.breakWord}
//             >
//               {status.text}
//             </Typography>
//             <Typography
//               component="div"
//               variant="caption"
//               color="textPrimary"
//               className={classes.breakWord}
//             >
//               {requestedBy}
//             </Typography>
//             <Typography
//               component="div"
//               variant="caption"
//               color="textPrimary"
//               className={classes.breakWord}
//             >
//               {assignedWorker}
//             </Typography>
//           </Fragment>
//         }
//       />
//     </ListItem>
//   );
// }

export default params => {
  const classes = useStyles();
  const { open, toggleDialog, fileDetails } = params;

  const [propsOpen, setPropsOpen] = useState({
    dates: false,
    operations: true,
    tags: true
  });

  const togglePropsOpen = prop => {
    setPropsOpen({
      ...propsOpen,
      [prop]: !propsOpen[prop]
    });
  };

  const { fileName, path, date, project } = fileDetails;
  const modified = date && date.modified;
  const birth = date && date.birth;
  const mapped = date && date.mapped;

  const [fileInfo, setFileInfo] = useState({
    operations: [],
    tags: []
  });

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();
    const url = `${api_server}/search/${project}/get-ops/file=${fileName}/path=${path}`;
    Axios.get(url)
      .then(results => {
        if (!unmounted) {
          const { operations, tags } = results.data;
          setFileInfo({ operations, tags });
        }
      })
      .catch(e => {
        if (!unmounted) {
          Axios.isCancel(e)
            ? console.log(`Request cancelled:${e.message}`)
            : console.log("Another error happened:" + e.message);
        }
      });

    return () => {
      unmounted = true;
      source.cancel("Cancelling in cleanup");
    };
  }, [fileName, project, path]);

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
            icon={<MyLocation color="primary" />}
            primaryText={fileName}
            secondaryText={path}
          />
          <ListItem button onClick={() => togglePropsOpen("dates")}>
            <ListItemIcon>
              <CalendarToday color="primary" />
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
              <LabelIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Tags" />
            {propsOpen.tags ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={propsOpen.tags} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {/* <EnhancedListItem
                icon={<LabelImportant />}
                primaryText="Test"
                secondaryText="Value"
                nested={true}
              /> */}
            </List>
          </Collapse>

          <ListItem button onClick={() => togglePropsOpen("operations")}>
            <ListItemIcon>
              <AssignmentIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Operations" />
            {propsOpen.operations ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={propsOpen.operations} timeout="auto" unmountOnExit>
            <OperationsTable operations={fileInfo.operations} />
          </Collapse>

          {/* {extension === "kml" && (
            <React.Fragment>
              <ListItem button onClick={() => togglePropsOpen("mapViewer")}>
                <ListItemIcon>
                  <MapIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="Map Viewer" />
                {propsOpen.mapViewer ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={propsOpen.mapViewer} timeout="auto" unmountOnExit>
                <ContentsMapView />
              </Collapse>
            </React.Fragment>
          )} */}
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

function OperationsTable(params) {
  const { operations } = params;

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell align="right">Operation</TableCell>
          <TableCell align="right">Requester</TableCell>
          <TableCell align="right">Server</TableCell>
          <TableCell align="right">Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {operations.map(row => (
          <TableRow key={row._id}>
            <TableCell component="th" scope="row">
              {new Date(row.requestDate).toLocaleString()}
            </TableCell>
            <TableCell align="right">{row.operation}</TableCell>
            <TableCell align="right">{row.requestedBy}</TableCell>
            <TableCell align="right">{row.assignedWorker}</TableCell>
            <TableCell align="right">{row.status && row.status.text}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
