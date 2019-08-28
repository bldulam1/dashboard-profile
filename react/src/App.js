import React from "react";
import theme from "./themes/Main";
import "./App.css";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import MainFrame from "./frame/Frame";
import { AzureAD, MsalAuthProviderFactory, LoginType } from "react-aad-msal";

export default () => {
  const config = {
    auth: {
      authority: "https://login.microsoftonline.com/organizations",
      clientId: "8d328dfa-6f5f-442e-baf0-f7cc55bb9ba1",
      redirectUri: "https://jp01-of-wl8197:3000"
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  };

  const authenticationParameters = {
    scopes: ["user.read"]
  };

  const unauthenticatedFunction = loginFunction => {
    return <button>login</button>;
  };

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AzureAD
          provider={
            new MsalAuthProviderFactory(
              config,
              authenticationParameters,
              LoginType.Redirect
            )
          }
          forceLogin={true}
          unauthenticatedFunction={unauthenticatedFunction}
          accountInfoCallback={userInfo => console.log(userInfo)}
          authenticatedFunction={() => <MainFrame />}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
};
