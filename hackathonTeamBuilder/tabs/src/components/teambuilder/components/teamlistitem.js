import React from 'react';
import { Card, Button, Icon } from 'semantic-ui-react'
//links to general of prod channel
const DEF_TEAMSLINK='https://teams.microsoft.com/l/channel/19%3a6c83ba5af8664dc3b1a0d8a8a0774094%40thread.tacv2/General?groupId=abc0763c-f446-424c-ba5f-e374147c11a0&tenantId=e773e193-89d3-44d9-ae4e-17766699f674';
class TeamListItem extends React.Component {
  
  
  getTeamsLink=()=>{
    return this.props.teamslink?this.props.teamslink:DEF_TEAMSLINK;
  }


  render() {
    let islead=this.props.islead?this.props.islead===1:false;
    if(!this.props.team){return "";}
    return(
      
        
          <Card fluid color='teal'>
            <Card.Content>
            {!this.props.isTeamMember? 
                (!this.props.hasTeam? <Button floated='right' basic color="green" onClick={()=>{this.props.Callback(true,this.props.team.id)}}>Join</Button>: '' )            
              :              
                <div >                  
                  <Button floated='right' basic color='red' onClick={()=>{this.props.Callback(false,this.props.team.id)}}>Leave</Button>   
                  <Button floated='right' basic color='blue' onClick={()=>{this.props.edit()}}>Edit</Button>
                  {islead?
                  <Button floated='right' color="red" onClick={()=>{this.props.Callback(true,this.props.team.id,0)}} icon>
                  <Icon name='heart' />
                  Don't Lead
                </Button>
                  :
                  <Button floated='right' color="green" onClick={()=>{this.props.Callback(true,this.props.team.id,1)}} icon>
                    <Icon name='heart' />
                    Lead
                  </Button>
                  }
                                             
                </div>                
              }             
              <Card.Header>
              {this.props.team.msTeamsChannel} : {this.props.team.teamName}                                    
              </Card.Header>
                         
              <Card.Description>
              <strong>{this.props.team.teamDescription}
                <br></br>
                {this.props.team.Users.hackers.length} teamMembers
                <br></br>

               We are looking for people with the following skills:</strong> {this.props.team.skills}
                <br/>
              </Card.Description>    
            </Card.Content>            
          </Card>

       
      
    )
  }
}

export default TeamListItem;