import React from "react";
// https://fluentsite.z22.web.core.windows.net/quick-start
import { Provider, teamsTheme, Loader, teamsDarkTheme, teamsHighContrastTheme } from "@fluentui/react-northstar";
import { HashRouter as Router, Redirect, Route } from "react-router-dom";
import { useTeamsFx } from "./sample/lib/useTeamsFx";
import { loadConfiguration } from "@microsoft/teamsfx";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import Tab from "./Tab";
import "./App.css";
import TabConfig from "./TabConfig";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const { theme, loading } = useTeamsFx();
  
  loadConfiguration({
    authentication: {
      initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL,
      simpleAuthEndpoint: process.env.REACT_APP_TEAMSFX_ENDPOINT,
      clientId: process.env.REACT_APP_CLIENT_ID
    }
  });
  
  return (
    <Provider theme={theme || teamsTheme || teamsDarkTheme || teamsHighContrastTheme}>
      <Router>
        <Route exact path="/">
          <Redirect to="/tab" />
        </Route>
        {loading ? (
          <Loader style={{ margin: 100 }} />
        ) : (
          <>
            <Route exact path="/privacy" component={Privacy} />
            <Route exact path="/termsofuse" component={TermsOfUse} />
            <Route exact path="/tab" component={Tab} />
            <Route exact path="/config" component={TabConfig} />
          </>
        )}
      </Router>
    </Provider>
  );
}
