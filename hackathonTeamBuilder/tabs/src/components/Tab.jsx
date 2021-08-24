import React from "react";
import {loadConfiguration , TeamsUserCredential} from "@microsoft/teamsfx";
import TBApp from "./teambuilder/TBApp";
import {
 List
} from '@fluentui/react-northstar';

import { Welcome } from "./sample/Welcome";

class Tab extends React.Component {
  groupBy(array, property) {
    var hash = {};
    for (var i = 0; i < array.length; i++) {
        if (!hash[array[i][property]]) hash[array[i][property]] = [];
        hash[array[i][property]].push(array[i]);
    }
    return hash;
}

render() {
  loadConfiguration({
    authentication: {
      initiateLoginEndpoint: '.',
      simpleAuthEndpoint: "https://login.microsoftonline.com/e773e193-89d3-44d9-ae4e-17766699f674",
      clientId: 'b3544b0c-1209-4fe8-b799-8f63a0179fa0',
    },
  });
  const credential = new TeamsUserCredential();
  const token="hi";
  const scopes=["api://05fc1a93-6c0e-4af6-9424-368474961462/user_impersonation"];
  const token = credential.getToken(scopes)
  .then((res)=>{
    console.log(res);
    console.log(res);
  }); 
  
  
  return <div>
  
    {token?
      <div>
        got token
      </div>
      :<h2>Fetching Token</h2>
    }
    <TBApp/>
    <Welcome showFunction={ false } />
  </div>;
}
}
export default Tab;