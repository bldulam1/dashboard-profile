import { createContext } from "react";

export const ProjectContext = createContext({
  activeProject: "",
  setActiveProject: null
});
