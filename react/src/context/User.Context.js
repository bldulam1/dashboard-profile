import { createContext } from "react";

export const UserContext = createContext({
  name: null,
  email: null
});
