import nh4h from './nh4h';
import { gql } from '@apollo/client';
import graphapi from './graphapi';

function Team() {
  const TEAMSQUERY = gql `
  query{
    teams:getAllTeams{teamName id:teamId teamDescription   githubURL 
      skillsWanted modifiedBy createdBy challengeName
      msTeamsChannel Users{hackers{islead name} }}
  }
  `;

  const APIURL = '/solutions';

  var teamid = 0;
  var allteams = [];

  async function getAllTeams(authToken) {
    let client = graphapi(authToken);
    let response = await client.query({ query: TEAMSQUERY });
    if (response.data) {
      return response.data.teams;
    }
  }

  async function createNewTeam(authToken, body) {
    let apiClient = nh4h(authToken);

    let response = await apiClient.post(APIURL, body);
    console.log("in team createNewTeam", response);
    if (response.data) {
      return response.data.teamId;
    }
  }

  async function editTeam(authToken, teamid, body) {
    let apiClient = nh4h(authToken);
    await apiClient.put('/solutions/' + teamid, body);
  }

  return {
    getAllTeams: getAllTeams,
    createNewTeam: createNewTeam,
    editTeam: editTeam
  }
}

export default Team;