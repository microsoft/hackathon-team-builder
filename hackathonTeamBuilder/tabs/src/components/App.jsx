import React from "react";
// https://fluentsite.z22.web.core.windows.net/quick-start
import { Provider } from "@fluentui/react-northstar";
import { HashRouter as Router, Redirect, Route } from "react-router-dom";
import { useTeamsFx } from "./sample/lib/useTeamsFx";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import "./App.css";
import TabConfig from "./TabConfig";
import TeamBuilder from "./teambuilder/TeamBuilder";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const { theme } = useTeamsFx();
  
  return (
    <Provider theme={theme}>
      <Router>
        <Route exact path="/">
          <Redirect to="/tab" />
        </Route>
        <Route exact path="/privacy" component={Privacy} />
        <Route exact path="/termsofuse" component={TermsOfUse} />
        <Route exact path="/tab" component={TeamBuilder} />
        <Route exact path="/config" component={TabConfig} />
      </Router>
    </Provider>
  );
}
