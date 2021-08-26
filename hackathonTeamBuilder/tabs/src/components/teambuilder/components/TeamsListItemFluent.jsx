import React from "react";
import {loadConfiguration , TeamsUserCredential} from "@microsoft/teamsfx";
import {
  Button,
 List,GroupedList,Accordion,ItemLayout,Image,Flex,Header,Text,Label, mergeThemes,teamsTheme,Provider
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
           
            
    
  
        }
      }
      }

      joinOrLeaveTeam=(type, id, name, isCreate, islead)=>{
        this.props.Callback(type, id, name, isCreate, islead);
      }
      editTeam=(e)=>{
        this.props.edit();
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

  var key=Object.keys(jsonData);
  var myKeyValuePairs =[];
  for(var i=0;i<key.length;i++){

    myKeyValuePairs.push({'header':jsonData[i].name , 'key':jsonData[i].challengeName} );

  }
  return myKeyValuePairs;
}


getUsersTeams(jsonData){

  var key=Object.keys(jsonData);
  var myKeyValuePairs =[];

  for(var i=0;i<key.length;i++){

    myKeyValuePairs.push({'users':jsonData[i].Users.hackers});
  }
  return myKeyValuePairs;
}



render() {
    const dontLeadButton = {
        siteVariables: {
          colorScheme: {
            brand: {
              'background': 'darkorange',
            }
          }
        }
      }

      const leadButton = {
        siteVariables: {
          colorScheme: {
            brand: {
              'background': 'green',
            }
          }
        }
      }
      
      const editButton = {
        siteVariables: {
          colorScheme: {
            brand: {
              'background': 'darkblue',
            }
          }
        }
      }
  let cmeta=this.groupBy(this.props.teams,'challengeName');
 console.log(cmeta);
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
                                        <div style={{position: 'relative',}}>
                                            <Header as="h4" content={team.msTeamsChannel} />
                                            {
                                                team.Users.hackers.map(user => (
                                                <span key={user}>
                                                    <Label color=
                                                    
                                                    {user.islead ? (

                                                        "orange"


                                        ):
                                        (
                                                "green"


                                        )



                                        }
                                                    
                                                                                                        
                                        content={user.name} />{' '}
                                                    

                                               
                                                </span>
                                            ))}
                                            {!this.props.isTeamMember ? (//this.props.isTeamMember
                                                !this.props.hasTeam ? (//this.props.hasTeam 
                                                    <Flex   gap="gap.medium" padding="padding.medium">
                                                    <Button primary 
                                                        onClick={() => {
                                                            this.joinOrLeaveTeam(
                                                            true,
                                                            team.id,
                                                            team.teamName
                                                            );
                                                        }}
                                                        >
                                                        Join
                                                    </Button>
                                                    </Flex>
                                                ) : (


                                                           <br> </br>



                                                )
                                            ) : (

                                            <Flex   gap="gap.medium" padding="padding.medium">
                                                <Provider theme={mergeThemes(teamsTheme, dontLeadButton)}>
                                                <Button primary 
                                                        onClick={() => {
                                                            this.joinOrLeaveTeam(
                                                            false,
                                                            team.id,
                                                            team.teamName
                                                            );
                                                        }}
                                                        >
                                                        Leave
                                                    </Button>
                                                    </Provider>
                                                <Provider theme={mergeThemes(teamsTheme, editButton)}>
                                                <Button primary 
                                                onClick={() => {
                                                    this.editTeam()
                                                   
                                                }}
                                                >
                                                Edit
                                            </Button>
                                            </Provider>
                                                {
                                                    this.props.islead ? (//this.props.islead

                                                        <Flex   gap="gap.medium" padding="padding.medium">
                                                        <Provider theme={mergeThemes(teamsTheme, dontLeadButton)}>
                                                    <Button primary 
                                                        onClick={() => {
                                                           this.joinOrLeaveTeam(
                                                               true,
                                                               team.id,
                                                               team.teamName,
                                                               0,
                                                               1
                                                             );
                                                        }}
                                                        >
                                                        Don't Lead
                                                    </Button>
                                                    </Provider>
                                                    </Flex>
        
                                                    ):(
        
        
                                                    
                                                        <Provider theme={mergeThemes(teamsTheme, leadButton)}>
                                                    <Button primary 
                                                        onClick={() => {
                                                           this.joinOrLeaveTeam(
                                                               true,
                                                               team.id,
                                                               team.teamName,
                                                               0,
                                                               1
                                                             );
                                                        }}
                                                        >
                                                        Lead
                                                    </Button>
                                                    </Provider>
        
                                                    )
                                                }

                                            
                                            </Flex>
                                              
                                              




                                              

                                            )
                                                
                                                
                                                
                                                
                                                
                                                
                                                
                                                  
                                            }

                                           
                                            
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