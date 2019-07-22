import React from "react";
import Dashboard from "../components/Dashboard";
import Search from "../components/Search";
import Upload from "../components/Upload";
import Maps from "../components/Maps";
import TestCatalog from "../components/TestCatalog";
import SettingsUser from "../components/Settings.User";
import SettingsProject from "../components/Settings.Project";

import DashboardIcon from "@material-ui/icons/Dashboard";
import SearchIcon from "@material-ui/icons/Search";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import MapIcon from "@material-ui/icons/Map";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import PersonIcon from "@material-ui/icons/Person";
import GroupIcon from "@material-ui/icons/Group";

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

const projects = [
  "Nissan L53H",
  "Renault-Nissan",
  "Subaru SVS",
  "Subaru 77GHz",
  "Honda NB2.0",
  "Toyota"
].sort();

const projectComponents = new Set([
  Component("search", "/:project/search", Search, projects, <SearchIcon />),
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
    ["Nissan L53H", "Renault-Nissan"],
    <CloudUploadIcon />
  ),
  Component(
    "maps",
    "/:project/maps",
    Maps,
    ["Nissan L53H", "Renault-Nissan", "Subaru SVS"],
    <MapIcon />
  ),
  Component(
    "testCatalog",
    "/:project/testCatalog",
    TestCatalog,
    ["Nissan L53H", "Renault-Nissan"],
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
  ),
];

export { projects, getProjectComponents, settingsComponents };
