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
            console.log(this.props.teams);
            let newt=this.groupBy(this.props.teams,'challengeName');
            let newc= Object.getOwnPropertyNames(newt);
            console.log("newt hey");
            console.log(newt);
            console.log("newc");
            console.log(newc);
            this.setState({
              teams:newt,
              challenges:newc
            });
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
  
 console.log(this.state.teams);
 
var users=this.getUsersTeams(teams2);
//console.log("users");
//console.log(users);
  const panels = [
   
    {
      key: 'd',
      title: "this.props.newc",
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

  let cmeta=this.groupBy(this.props.teams,'challengeName');
  let categories= Object.getOwnPropertyNames(cmeta);
  let test=this.getValues(this.props.teams);
 // let users=this.getTeams(teams);
  return <div>
    
 
    <Accordion defaultActiveIndex={[0]} panels=
   
    {
        users[1].users.map(color => (


            

            {
                key: 'd',
                title: color.name,
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
              }












      ))}
     
      />
    
  </div>;
}
}
export default TeamsListItemFluent;