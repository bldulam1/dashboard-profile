import { createContext } from "react";

export const DashboardContext = createContext({
  dashboard: { servers: [], serverTypes: [] },
  dashboardDispatch: null
});
