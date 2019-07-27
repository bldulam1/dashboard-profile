import React from "react";
import theme from "./themes/Main";
import "./App.css";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { BrowserRouter } from "react-router-dom";
// import MainFrame from "./frame/MainFrame";
import MainFrame from "./frame/Frame";

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <MainFrame />
      </BrowserRouter>
    </ThemeProvider>
  );
};
