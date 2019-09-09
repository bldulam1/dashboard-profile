import React, { useState } from "react";
import theme from "./themes/Main";
import "./App.css";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { BrowserRouter } from "react-router-dom";
import MainFrame from "./frame/Frame";
import { AzureAD, MsalAuthProviderFactory, LoginType } from "react-aad-msal";
import { UserContext } from "./context/User.Context";
import Axios from "../../main-server/node_modules/axios";
import { api_server, redirectUri, clientId } from "./environment/environment";

export default () => {
  const [user, setUser] = useState({
    _id: "",
    name: "",
    email: "",
    projects: [{ name: "", role: 0, roleLevel: "Guest" }]
  });

  const config = {
    auth: {
      authority: "https://login.microsoftonline.com/organizations",
      clientId,
      redirectUri
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

  const handleUserInfo = async userInfo => {
    const { name, userName } = userInfo.account;

    const results = await Axios.post(`${api_server}/user/login/${name}`, {
      name,
      email: userName
    });
    // console.log(results.data);

    setUser(results.data);
  };

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ ...user }}>
        <BrowserRouter>
          <AzureAD
            provider={provider}
            forceLogin={true}
            unauthenticatedFunction={unauthenticatedFunction}
            authenticatedFunction={() => <MainFrame />}
            accountInfoCallback={handleUserInfo}
          />
        </BrowserRouter>
      </UserContext.Provider>
    </ThemeProvider>
  );
};
