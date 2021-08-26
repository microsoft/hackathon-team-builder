import React from "react";
import {loadConfiguration , TeamsUserCredential} from "@microsoft/teamsfx";
import TBApp from "./teambuilder/TBApp";
import {
  Button,
 List,GroupedList,Accordion,ItemLayout,Image,Flex,Header,Text,Label
} from '@fluentui/react-northstar';


class Tab extends React.Component {
  groupBy(array, property) {
    var hash = {};
    for (var i = 0; i < array.length; i++) {
        if (!hash[array[i][property]]) hash[array[i][property]] = [];
        hash[array[i][property]].push(array[i]);
    }
    return hash;
}

getValues(jsonData){

  //var jsonArray = '{"required":1, "minlength":2}'
  //console.log(jsonData);
  //console.log(jsonData[0]);
  var key=Object.keys(jsonData);
  var myKeyValuePairs =[];
  //const mapped = Object.entries(items).map(([k,v]) => `${k}_${v}`);
//console.log(mapped);
  for(var i=0;i<key.length;i++){

    myKeyValuePairs.push({'header':jsonData[i].name , 'key':jsonData[i].challengeName} );
    //{'id':5}
   // obj
    //obj.key3 = "value3";

  }
 // console.log(myKeyValuePairs);
  return myKeyValuePairs;
}


getUsersTeams(jsonData){

  //var jsonArray = '{"required":1, "minlength":2}'
 // console.log(jsonData);
  //console.log(jsonData[0]);
  var key=Object.keys(jsonData);
  var myKeyValuePairs =[];
  //const mapped = Object.entries(items).map(([k,v]) => `${k}_${v}`);
//console.log(mapped);
  for(var i=0;i<key.length;i++){

    myKeyValuePairs.push({'users':jsonData[i].Users.hackers});
    //{'id':5}
   // obj
    //obj.key3 = "value3";

  }
 // console.log(myKeyValuePairs);
  return myKeyValuePairs;
}



render() {
  
 
  


  //let cmeta=this.groupBy(teams,'challengeName');
  //let categories= Object.getOwnPropertyNames(cmeta);
  //let test=this.getValues(teams);
 // let users=this.getTeams(teams);
  return <div>
    
    <TBApp key="12"/>
   
   
    
     

    
  </div>;
}
}
export default Tab;