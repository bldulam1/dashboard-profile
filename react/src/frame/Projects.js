import React from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import Search from "../components/Search/Search";
import Upload from "../components/Uploads/Upload";
import Maps from "../components/Maps";
import SettingsUser from "../components/Settings.User";
import SettingsProject from "../components/Settings.Project";

import DashboardIcon from "@material-ui/icons/Dashboard";
import SearchIcon from "@material-ui/icons/Search";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import MapIcon from "@material-ui/icons/Map";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import PersonIcon from "@material-ui/icons/Person";
import GroupIcon from "@material-ui/icons/Group";
import WorkIcon from "@material-ui/icons/Work";
import Tasks from "../components/Tasks/Tasks";
import TestCatalog from "../components/TestCatalog/TestCatalog";
import { projects } from "../environment/config";

function Component(name, route, component, projects, icon) {
  return { name, route, component, projects, icon };
}

function getProjectComponents(projectName) {
  let ret_components = [];
  projectComponents.forEach(component => {
    if (component.projects.includes(projectName)) {
      ret_components.push(component);
    }
  });
  return ret_components;
}

const projectComponents = new Set([
  Component("search", "/:project/search", Search, projects, <SearchIcon />),
  Component("tasks", "/:project/tasks", Tasks, projects, <WorkIcon />),
  Component(
    "dashboard",
    "/:project/dashboard",
    Dashboard,
    projects,
    <DashboardIcon />
  ),
  Component(
    "upload",
    "/:project/upload",
    Upload,
    projects,
    <CloudUploadIcon />
  ),
  Component(
    "maps",
    "/:project/maps",
    Maps,
    ["Nissan L53H", "Renault Nissan", "Subaru SVS"],
    <MapIcon />
  ),
  Component(
    "test catalog",
    "/:project/test-catalog",
    TestCatalog,
    ["Nissan L53H", "Renault Nissan"],
    <LocalLibraryIcon />
  )
]);

const settingsComponents = [
  Component(
    "User Settings",
    "/settings/user",
    SettingsUser,
    projects,
    <PersonIcon />
  ),
  Component(
    "Project Settings",
    "/settings/project",
    SettingsProject,
    projects,
    <GroupIcon />
  )
];

export { getProjectComponents, settingsComponents };
