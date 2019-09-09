import React, { useContext } from "react";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import useToggle from "../hooks/useToggle";
import uuid from "uuid";
import { Route, Link, Redirect } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import logo from "../logo.svg";

import { getProjectComponents, settingsComponents } from "../frame/Projects";

import { useStyles } from "../styles/classes";
import { ProjectContext } from "../context/Project.Context";
import { UserContext } from "../context/User.Context";
import { getInitials } from "../util/strings";

export default () => {
  const { name, projects } = useContext(UserContext).user;
  const defaultProject = projects.length
    ? projects.sort((a, b) => b.roleLevel - a.roleLevel)[0].name
    : "";
  const [open, toggleDrawer] = useToggle(false);
  const [activeProject, setActiveProject] = React.useState(defaultProject);
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ProjectContext.Provider value={{ activeProject, setActiveProject }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={toggleDrawer}
                edge="start"
                className={clsx(classes.menuButton)}
              >
                <MenuIcon />
              </IconButton>
              <div className={classes.toolbar}>
                <img src={logo} alt="Clarity" style={{ height: "3rem" }} />
              </div>
            </div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              // onClick={handleMenu}
            >
              <Tooltip title={name}>
                <Avatar className={classes.colorSecondary}>
                  {getInitials(name)}
                </Avatar>
              </Tooltip>
            </IconButton>
          </Toolbar>
        </AppBar>
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

          <ProjectSelection open={open} />
          <ProjectComponents open={open} />
          <SettingsComponents open={open} />
        </Drawer>
        <SnackbarProvider maxSnack={5}>
          <main
            className={
              open ? classes.contentDrawerOpen : classes.contentDrawerClose
            }
          >
            {getProjectComponents(activeProject).map(comp => (
              <Route
                exact
                key={uuid()}
                path={comp.route}
                component={comp.component}
              />
            ))}
            {settingsComponents.map(({ route, component }) => (
              <Route exact key={uuid()} path={route} component={component} />
            ))}
            <Route
              exact
              path="/"
              render={() => <Redirect to={`/${activeProject}/search`} />}
            />
          </main>
        </SnackbarProvider>
      </ProjectContext.Provider>
    </div>
  );
};

function ProjectNavItem(props) {
  const { activeProject, setActiveProject } = useContext(ProjectContext);
  const { open, project, toggleList, listOpen, isPrimary, role } = props;
  const classes = useStyles();

  const onProjectClick = () => {
    toggleList();
    !isPrimary && setActiveProject(project);
  };

  return (
    <Link
      to={activeProject !== project ? `/${project}/Dashboard` : "#"}
      className={classes.navBarItem}
      style={{
        textDecoration: "none",
        color: "#E0C1CB",
        justifyContent: open ? "left" : "center",
        paddingLeft: open ? "1rem" : "0rem"
      }}
      onClick={onProjectClick}
    >
      <Tooltip title={isPrimary ? `Active Project: ${project}` : project}>
        <Avatar
          className={
            isPrimary ? classes.primaryAvatar : classes.secondaryAvatar
          }
        >
          {getInitials(project)}
        </Avatar>
      </Tooltip>
      <Tooltip title={role ? `Role: ${role}` : ""}>
        <Typography hidden={!open} style={{ paddingLeft: "1rem" }}>
          {project}
        </Typography>
      </Tooltip>
      {isPrimary && (
        <span hidden={!open} style={{ float: "right" }}>
          {listOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </span>
      )}
    </Link>
  );
}

function ProjectSelection(props) {
  const [listOpen, toggleList] = useToggle(false);
  const { activeProject } = useContext(ProjectContext);
  const { projects } = useContext(UserContext).user;
  const { open } = props;
  const classes = useStyles();

  return (
    <div>
      <Typography
        className={classes.navBarGroupLabel}
        variant="subtitle2"
        hidden={!open}
        style={{ paddingTop: "1rem" }}
      >
        Active Project
      </Typography>
      <ProjectNavItem
        open={open}
        project={activeProject}
        toggleList={toggleList}
        listOpen={listOpen}
        isPrimary={true}
      />
      {listOpen &&
        projects.map(project => (
          <ProjectNavItem
            key={uuid()}
            open={open}
            role={project.role}
            project={project.name}
            toggleList={toggleList}
            listOpen={listOpen}
          />
        ))}
    </div>
  );
}

function ProjectComponents(props) {
  const { open } = props;
  const { activeProject } = useContext(ProjectContext);

  const classes = useStyles();
  const components = getProjectComponents(activeProject);
  return (
    <div>
      <Typography
        className={classes.navBarGroupLabel}
        variant="subtitle2"
        hidden={!open}
      >
        components
      </Typography>

      {components.map(({ name, icon, route }) => (
        <Link
          to={route.replace(":project", activeProject)}
          key={uuid()}
          style={{ textDecoration: "none", color: "#E0C1CB" }}
        >
          <div
            className={classes.navBarItem}
            style={{
              justifyContent: open ? "left" : "center",
              paddingLeft: open ? "1rem" : "0rem"
            }}
          >
            <Tooltip title={name}>{icon}</Tooltip>
            <Typography
              hidden={!open}
              style={{ paddingLeft: "1rem" }}
              className={classes.navBarItemLabel}
            >
              {name}
            </Typography>
          </div>
        </Link>
      ))}
      {/* {!open && <Divider className={classes.drawerDivider} variant="middle" />} */}
    </div>
  );
}

function SettingsComponents(props) {
  const { open } = props;
  const classes = useStyles();
  return (
    <div>
      <Typography
        className={classes.navBarGroupLabel}
        variant="subtitle2"
        hidden={!open}
      >
        settings
      </Typography>
      {settingsComponents.map(({ name, icon, route }) => (
        <Link
          to={route}
          key={uuid()}
          style={{ textDecoration: "none", color: "#E0C1CB" }}
        >
          <div
            className={classes.navBarItem}
            style={{
              justifyContent: open ? "left" : "center",
              paddingLeft: open ? "1rem" : "0rem"
            }}
          >
            <Tooltip title={name}>{icon}</Tooltip>
            <Typography
              hidden={!open}
              style={{ paddingLeft: "1rem" }}
              className={classes.navBarItemLabel}
            >
              {name}
            </Typography>
          </div>
        </Link>
      ))}
    </div>
  );
}
