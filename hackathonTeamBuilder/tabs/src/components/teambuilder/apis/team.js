import nh4h from './nh4h';
import { gql } from '@apollo/client';
import graphapi from './graphapi';
import { loader } from 'graphql.macro';


function Team() {
  const TEAMSQUERY = loader('../graphql/teamquery.graphql');
  const ADDTEAM = loader('../graphql/addteam.graphql');
  const EDITTEAM = loader('../graphql/editteam.graphql');
  const JOINTEAM = loader('../graphql/jointeam.graphql');
  const LEAVETEAM = loader('../graphql/leaveteam.graphql');
  const LEADTEAM  = loader('../graphql/leadteam.graphql');

  // authToken: jwt bearer token to call graphql api
  // email: email of the logged in user
  async function getAllTeams(authToken, email) {
    let client = graphapi(authToken);
    let response = await client.query({ query: TEAMSQUERY, variables: { email } });
    if (response.data) {
      return response.data;
    }
  }

  async function createNewTeam(authToken, input) {
    let client = graphapi(authToken);

    let response = await client.mutate({ mutation: ADDTEAM, variables: { input } });
    if (!response.data.addTeam.errors) {
      return response.data.addTeam.team.id;
    }
  }

  async function editTeam(authToken, input) {
    let client = graphapi(authToken);

    let response = await client.mutate({ mutation: EDITTEAM, variables: { input } });
    if (!response.data.editTeam.errors) {
      return response.data.editTeam.team.id;
    }
  }

  async function joinTeam(authToken, input) {
    let client = graphapi(authToken);

    let response = await client.mutate({ mutation: JOINTEAM, variables: { input } });
    return (!response.data.joinTeam.errors);
  }

  async function leaveTeam(authToken, input) {
    let client = graphapi(authToken);

    let response = await client.mutate({ mutation: LEAVETEAM, variables: { input } });
    return response.data.leaveTeam;
  }

  async function leadTeam(authToken, input) {
    let client = graphapi(authToken);

    let response = await client.mutate({ mutation: LEADTEAM, variables: { input } });
    return (!response.data.leadTeam.errors);
  }

  return {
    getAllTeams: getAllTeams,
    createNewTeam: createNewTeam,
    editTeam: editTeam,
    joinTeam: joinTeam,
    leaveTeam: leaveTeam,
    leadTeam: leadTeam
  }
}

export default Team;