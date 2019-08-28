import React, { useState } from "react";
import theme from "./themes/Main";
import "./App.css";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import MainFrame from "./frame/Frame";
import { AzureAD, MsalAuthProviderFactory, LoginType } from "react-aad-msal";
import { UserContext } from "./context/User.Context";

export default () => {
  const [user, setUser] = useState({
    name: null,
    email: null
  });

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

  const provider = new MsalAuthProviderFactory(
    config,
    authenticationParameters,
    LoginType.Redirect
  );

  const unauthenticatedFunction = loginFunction => {
    return <button>login</button>;
  };

  const handleUserInfo = userInfo => {
    const { name, userName } = userInfo.account;
    setUser({ name, email: userName });
  };

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ ...user }}>
        <BrowserRouter>
          <AzureAD
            provider={provider}
            forceLogin={true}
            unauthenticatedFunction={unauthenticatedFunction}
            accountInfoCallback={handleUserInfo}
            authenticatedFunction={() => <MainFrame />}
          />
        </BrowserRouter>
      </UserContext.Provider>
    </ThemeProvider>
  );
};
