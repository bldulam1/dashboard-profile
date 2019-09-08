import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Link from "@material-ui/core/Link";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import clsx from "clsx";

import makeStyles from "@material-ui/core/styles/makeStyles";
import useToggle from "../hooks/useToggle";
import uuid from "uuid";

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#10000B",
    color: "#E0C1CB"
  },
  icon: {
    color: "#E0C1CB"
  },
  moduleMouseOver: {
    backgroundColor: theme.palette.primary.main
  },
  toolbar: theme.mixins.toolbar
}));

export default navbarGroups => {
  const classes = useStyles();
  const [open, toggleDrawer] = useToggle(false);

  // const [isMouseOver, toggleIsMouseOver] = useToggle(false);

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })
      }}
      open={open}
    >
      <div className={classes.toolbar} />
      {navbarGroups.map(group => (
        <div key={uuid()}>
          <Typography
            className={classes.navBarGroupLabel}
            variant="subtitle2"
            hidden={!open}
          >
            {group.name}
          </Typography>
          <List>
            {group.children.map(({ name, icon, link }, index) => (
              <Link
                to={link}
                key={uuid()}
                style={{ textDecoration: "none", color: "white" }}
              >
                <ListItem button className={classes.navBarItem}>
                  <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
                  <ListItemText
                    className={classes.navBarItemLabel}
                    primary={name}
                    hidden={!open}
                  />
                </ListItem>
              </Link>
            ))}
          </List>
        </div>
      ))}
    </Drawer>
  );
};
