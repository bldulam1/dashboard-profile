import React, { useContext, useReducer } from "react";
import { FileSearchContext } from "../../../../context/Search.Context";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Typography from "@material-ui/core/Typography";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import { normalizeSize, numberWithCommas } from "../../../../util/strings";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  expansionPanelDetails: {
    paddingLeft: 0,
    display: "flex",
    flexDirection: "column"
  },
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  breakWord: {
    wordWrap: "break-word"
  }
}));

function Info({ content, keyName }) {
  const { breakWord } = useStyles();
  return (
    <Typography
      component="div"
      variant="caption"
      className={breakWord}
      color="textPrimary"
    >
      <b style={{ marginRight: "0.5rem" }}>{keyName}</b>
      {content}
    </Typography>
  );
}
function reducer(state, action) {
  return { ...state, ...action };
}

export default params => {
  const { searchFileProps } = useContext(FileSearchContext);
  const { rootPaths } = searchFileProps;

  const classes = useStyles();
  const [rootPath, rootPathDispatch] = useReducer(reducer, {
    anchorEl: null,
    expanded: false
  });
  const { anchorEl, expanded } = rootPath;

  function handleRootMenuClick(event) {
    rootPathDispatch({ anchorEl: event.currentTarget });
  }

  function handleClose() {
    rootPathDispatch({ anchorEl: null });
  }

  const handleChange = panel => (event, isExpanded) => {
    rootPathDispatch({ expanded: isExpanded ? panel : false });
  };
  return (
    <ExpansionPanel
      style={{ padding: 0 }}
      expanded={expanded === "root-path-panel"}
      onChange={handleChange("root-path-panel")}
    >
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="root-path-panelbh-content"
        id="root-path-panelbh-header"
      >
        <Typography className={classes.heading}>Root Paths</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.expansionPanelDetails}>
        <List className={classes.root}>
          {rootPaths.map(({ _id, totalSize, count, date }, index) => {
            const labelId = `checkbox-list-label-${index}`;
            return (
              <ListItem key={_id} role={undefined} style={{ padding: 0 }}>
                <ListItemIcon style={{ minWidth: "1rem" }}>
                  <div>
                    <IconButton
                      color="primary"
                      className={classes.button}
                      aria-label="Root path operation"
                      component="span"
                      aria-controls="root-path-menu"
                      aria-haspopup="true"
                      onClick={handleRootMenuClick}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="root-path-menu"
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleClose} dense>
                        Reload
                      </MenuItem>
                    </Menu>
                  </div>
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  id={labelId}
                  primary={
                    <Tooltip title={_id} placement="top">
                      <Typography
                        component="div"
                        variant="caption"
                        className={classes.breakWord}
                      >
                        <b style={{ marginRight: "0.5rem" }}>{_id}</b>
                      </Typography>
                    </Tooltip>
                  }
                  secondary={
                    <div>
                      <Info
                        keyName="Total Size"
                        content={normalizeSize(totalSize)}
                      />
                      <Info
                        keyName="Count"
                        content={`${numberWithCommas(count)} files`}
                      />
                      <Info
                        keyName="Mapped"
                        content={new Date(date).toLocaleString()}
                      />
                    </div>
                  }
                />
              </ListItem>
            );
          })}
        </List>

        <form
          noValidate
          autoComplete="off"
          onSubmit={event => {
            event.preventDefault();
            console.log(event.target.value);
          }}
        >
          <TextField
            fullWidth
            id="new-root-path"
            label="New Root Path"
            // value={values.name}
            // onChange={handleChange("name")}
            margin="normal"
            style={{ width: "90%" }}
          />
        </form>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
