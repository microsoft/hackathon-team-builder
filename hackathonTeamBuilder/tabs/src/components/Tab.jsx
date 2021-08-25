import React from "react";
import {loadConfiguration , TeamsUserCredential} from "@microsoft/teamsfx";
import TBApp from "./teambuilder/TBApp";
import {
  Button,
 List,GroupedList,Accordion,ItemLayout,Image,Flex,Header,Text,Label
} from '@fluentui/react-northstar';
//import { List, ScrollToMode, IList } from '@fluentui/react-northstar/dist/';

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

getValues(jsonData){

  //var jsonArray = '{"required":1, "minlength":2}'
  console.log(jsonData);
  console.log(jsonData[0]);
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
  console.log(myKeyValuePairs);
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
  console.log(myKeyValuePairs);
  return myKeyValuePairs;
}



render() {
  
 
 
var users=this.getUsersTeams(teams);
console.log("users");
console.log(users);
  const panels = [
   
    {
      key: 'd',
      title: 'Track 4 - New Models and Settings for Care',
      content:<Flex gap="gap.medium" padding="padding.medium" debug>
      <Flex.Item size="size.large">
        <div
          style={{
            position: 'relative',
          }}
        >
          <Header as="h3" content="Mentah" />
          <Text  content="Access to and ability to receive mental healthcare, while helping patients to avoid stigma or judgments which might be associated with receiving said care and providing care where the patients are. One of the primary objectives is also to avoid undue burden or extra stress healthcare professionals." />
          
        </div>
      </Flex.Item>
  
      <Flex.Item  >
        
        <Flex   gap="gap.medium" padding="padding.medium" vAlign="stretch"> 


        <Flex  space="between"> 
          <Header as="h4" content="Team 4.02" />
          
   
          
  
          
        </Flex>

        
          
        <Flex   gap="gap.medium" padding="padding.medium">
        {
        users[1].users.map(color => (
        <span key={color}>
          <Label color="green" content={color.name} />{' '}
        </span>
      ))}
     
        

        
      </Flex>
          
  
          
        </Flex>

        
      </Flex.Item>

      
    </Flex>,
    },
  ];

  let cmeta=this.groupBy(teams,'challengeName');
  let categories= Object.getOwnPropertyNames(cmeta);
  let test=this.getValues(teams);
 // let users=this.getTeams(teams);
  return <div>
    
    <TBApp/>
    <Accordion defaultActiveIndex={[0]} panels={panels} />
   
    
     

    
  </div>;
}
}
export default Tab;