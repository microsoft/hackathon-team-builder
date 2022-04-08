import graphapi from './graphapi';
import { loader } from 'graphql.macro';
import { useSettings } from '../hooks/settings';

function Team(authToken) {
  const TEAMSQUERY = loader('../graphql/teamquery.graphql');
  const ADDTEAM = loader('../graphql/addteam.graphql');
  const EDITTEAM = loader('../graphql/editteam.graphql');
  const JOINTEAM = loader('../graphql/jointeam.graphql');
  const LEAVETEAM = loader('../graphql/leaveteam.graphql');
  const LEADTEAM  = loader('../graphql/leadteam.graphql');

  //const appSettings = useSettings({token: "123"});

  // authToken: jwt bearer token to call graphql api
  // email: email of the logged in user
  async function getAllTeams(userId) {
    let client = graphapi(authToken);
    let response = await client.query({ query: TEAMSQUERY, variables: { userId } });
    if (response.data) {
      return response.data;
    }
  }

  async function createNewTeam(input) {
    let client = graphapi(authToken);

    let response = await client.mutate({ mutation: ADDTEAM, variables: { input } });
    if (!response.data.addTeam.errors) {
      return response.data.addTeam.team.id;
    }
  }

  async function editTeam(input) {
    let client = graphapi(authToken);

    let response = await client.mutate({ mutation: EDITTEAM, variables: { input } });
    if (!response.data.editTeam.errors) {
      return response.data.editTeam.team.id;
    }
  }

  async function joinTeam(input) {
    let client = graphapi(authToken);

    let response = await client.mutate({ mutation: JOINTEAM, variables: { input } });
    return (!response.data.joinTeam.errors);
  }

  async function leaveTeam(input) {
    let client = graphapi(authToken);

    let response = await client.mutate({ mutation: LEAVETEAM, variables: { input } });
    return response.data.leaveTeam;
  }

  async function leadTeam(input) {
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