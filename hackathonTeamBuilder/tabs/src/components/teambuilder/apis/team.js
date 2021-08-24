import nh4h from './nh4h';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { gql } from '@apollo/client';
const TEAMSQUERY=gql `
query{
  teams:getAllTeams{teamName id:teamId teamDescription   githubURL 
    skillsWanted modifiedBy createdBy challengeName
    msTeamsChannel Users{hackers{islead name} }}
}
`;
class Team {
  static APIURL='/solutions';  
  static GRAPHAPIURL='https://nh4hgrap.azurewebsites.net/api/hack';//'http://localhost:7071/api/hack';
    
  teamid;
  allteams;
  graphclient;

  constructor(){
    this.allteams=[];
    this.graphclient = new ApolloClient({
      uri: Team.GRAPHAPIURL,
      cache: new InMemoryCache()
    });
  }

  getAllTeams=()=>{
   return this.graphclient.query({
      query:TEAMSQUERY
    }).then((response)=>{
      this.allteams=response.data.teams;
    });
  }
  createNewTeam=(body)=>{
    return nh4h.post(Team.APIURL, body)
          .then((response)=>{
            this.teamid=response.data.teamId;
          });
    
  }
  editTeam=(teamid,body)=>{
    return nh4h.put('/solutions/'+teamid,body );
  }
}
export default Team;