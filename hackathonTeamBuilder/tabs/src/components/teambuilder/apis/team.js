import nh4h from './nh4h';
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from '@apollo/client';
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

  constructor(authToken){
    const httpLink = new HttpLink({ uri: 'https://nh4hgrap.azurewebsites.net/api/hack' });

    const authLink = new ApolloLink((operation, forward) => {    
      // Use the setContext method to set the HTTP headers.
      operation.setContext({
        headers: {
          authorization: authToken ? `Bearer ${authToken}` : ''
        }
      });
    
      // Call the next link in the middleware chain.
      return forward(operation);
    });

    this.allteams=[];
    this.graphclient = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      
    });
  }

  getAllTeams = () => {
   return this.graphclient.query({
      query:TEAMSQUERY
    }).then((response)=>{
      this.allteams=response.data.teams;
    });
  }

  createNewTeam = (authToken, body) => {    
    let apiClient = nh4h(authToken);

    return apiClient.post(Team.APIURL, body)
          .then((response)=>{
            console.log("in team createNewTeam", response)
            this.teamid=response.data.teamId;
          });
    
  }

  editTeam = (authToken, teamid, body) => {
    let apiClient = nh4h(authToken);    
    return apiClient.put('/solutions/'+teamid,body );
  }
}
export default Team;