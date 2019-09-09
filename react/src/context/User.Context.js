import { createContext } from "react";

export const UserContext = createContext({
  user: {
    name: "",
    email: "",
    projects: []
  }
});
