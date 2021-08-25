import React from "react";

import TBApp from "./teambuilder/TBApp";
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
 
  
  return <div>
  
    <TBApp/>
  
  </div>;
}
}
export default Tab;