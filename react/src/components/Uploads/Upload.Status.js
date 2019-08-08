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
import { Status, getStatusValue } from "../../util/files";
import TablePagination from "@material-ui/core/TablePagination";

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

function reducer(state, action) {
  const { activeStatus, currentPage, itemsPerPage, type } = action;

  switch (type) {
    case "ActiveStatus":
      return { ...state, activeStatus };
    case "CurrentPage":
      return { ...state, currentPage };
    case "ItemsPerPage":
      return { ...state, itemsPerPage };
    default:
      return state;
  }
}

export default () => {
  const { uploadProps, uploadDispatch } = React.useContext(UploadContext);
  const { files } = uploadProps;
  const [uploadListProps, uploadListDispatch] = React.useReducer(reducer, {
    activeStatus: 0,
    currentPage: 0,
    itemsPerPage: 10,
    itemsPerPageOptions: [5, 10, 25]
  });
  const {
    activeStatus,
    currentPage,
    itemsPerPage,
    itemsPerPageOptions
  } = uploadListProps;

  const classes = useStyles();
  const status = [
    Status("pending", "pending", 0, false),
    Status("in progress", "in progress", 1, false),
    Status("completed", "completed", 2, false),
    Status("with issues", "with issues", 3, false)
  ];

  function handleChange(event, activeStatus) {
    uploadListDispatch({
      type: "ActiveStatus",
      activeStatus
    });
  }

  const handleCancelFile = filename => {
    uploadDispatch({
      type: "Files",
      files: files.filter(({ name }) => name !== filename)
    });
  };

  const handleChangePage = (event, newPage) => {
    uploadListDispatch({
      type: "CurrentPage",
      currentPage: newPage
    });
  };
  const handleChangeRowsPerPage = event => {
    uploadListDispatch({
      type: "ItemsPerPage",
      itemsPerPage: +event.target.value
    });
  };

  const activeFiles = files.filter(
    file => getStatusValue(file.progress) === activeStatus
  );

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
      <TablePagination
        rowsPerPageOptions={itemsPerPageOptions}
        component="div"
        count={activeFiles.length}
        rowsPerPage={itemsPerPage}
        page={currentPage}
        backIconButtonProps={{
          "aria-label": "previous page"
        }}
        nextIconButtonProps={{
          "aria-label": "next page"
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />

      <List>
        {activeFiles
          .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
          .map(file => (
            <Tooltip
              key={uuid()}
              title={file.progress < 0? file.issue.title :`${(100 * file.progress).toFixed(2)}%`}
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
                    <Typography noWrap variant="subtitle2">
                      {file.name}
                    </Typography>
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
