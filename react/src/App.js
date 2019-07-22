import React from "react";
import theme from "./themes/Main";
import "./App.css";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import MainFrame from "./frame/Frame";
import { BrowserRouter } from "react-router-dom";

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <MainFrame />
      </BrowserRouter>
    </ThemeProvider>
  );
};
