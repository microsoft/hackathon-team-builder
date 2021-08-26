import React from "react";
import {loadConfiguration , TeamsUserCredential} from "@microsoft/teamsfx";
import {
  Button,
 List,GroupedList,Accordion,ItemLayout,Image,Flex,Header,Text,Label
} from '@fluentui/react-northstar';


class TeamsListItemFluent extends React.Component {


    constructor(props){
        super(props);
        this.state = {
          teams: [],
          challenges:[],
          activeIndex: -1
        }
      }


      componentDidUpdate(prevProps,prevState) {
        if(prevProps.teams !== this.props.teams){
          if(this.props.teams){
            let newt=this.groupBy(this.props.teams,'challengeName');
            let newc= Object.getOwnPropertyNames(newt);
           
            //this.props.teams=newt;
            
    
  
        }
      }
      }

   
      
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
  //console.log(myKeyValuePairs);
  return myKeyValuePairs;
}



render() {
  
 //console.log(this.state.teams);
  

//var users=this.getUsersTeams(teams2);
//console.log("users");
//console.log(users);
  

  let cmeta=this.groupBy(this.props.teams,'challengeName');
 
  //this.props.teams=cmeta;

  
  
 // let users=this.getTeams(teams);
  return <div>


      {cmeta!=null
            ?   <Accordion  panels=
                    {
                    Object.entries(cmeta).map(([key,value]) => (
                        {
                        title: key,
                        content:<div>
                            {
                            value.map(team => (
                            <Flex gap="gap.medium" padding="padding.medium" debug style={{ minHeight: 130, }}>
                                <Flex.Item size="size.quarter">
                                    <div style={{position: 'relative',}} >
                                        <Header as="h3" content= {team.teamName} />
                                        <Text  content={team.teamDescription} />
                                    </div>
                                </Flex.Item>
                            
                                <Flex.Item>
                                        <Flex   gap="gap.medium" padding="padding.medium">
                                            <div style={{position: 'relative',}} >
                                                <Header as="h4" content={team.msTeamsChannel} />
                                                    {
                                                        team.Users.hackers.map(user => (
                                                        <span key={user}>
                                                            <Label color="green" content={user.name} />{' '}
                                                        </span>
                                                    ))}
                                            </div>
                                        </Flex>
                                </Flex.Item>
                            </Flex>
                            ))}
                        </div>
                        }
                    ))}
                />
            : <Button />
          }

    
 
  
    
  </div>;
}
}
export default TeamsListItemFluent;