import { useGraphQl } from '../hooks/useGraphQl';
import { loader } from 'graphql.macro';

function Team() {
  const TEAMSQUERY = loader('../graphql/teamquery.graphql');
  const ADDTEAM = loader('../graphql/addteam.graphql');
  const EDITTEAM = loader('../graphql/editteam.graphql');
  const JOINTEAM = loader('../graphql/jointeam.graphql');
  const LEAVETEAM = loader('../graphql/leaveteam.graphql');
  const LEADTEAM  = loader('../graphql/leadteam.graphql');

  const getAllTeamsReq = useGraphQl(async (client, userId) => await client.query({ query: TEAMSQUERY, variables: { userId } }));
  const createNewTeamReq = useGraphQl(async (client, input) => await client.mutate({ mutation: ADDTEAM, variables: { input } }));
  const editTeamReq = useGraphQl(async (client, input) => await client.mutate({ mutation: EDITTEAM, variables: { input } }));
  const joinTeamReq = useGraphQl(async (client, input) => await client.mutate({ mutation: JOINTEAM, variables: { input } }));
  const leaveTeamReq = useGraphQl(async (client, input) => await client.mutate({ mutation: LEAVETEAM, variables: { input } }));
  const leadTeamReq = useGraphQl(async (client, input) => await client.mutate({ mutation: LEADTEAM, variables: { input } }));
  //const appSettings = useSettings({token: "123"});

  return {
    getAllTeams: getAllTeamsReq,
    createNewTeam: createNewTeamReq,
    editTeam: editTeamReq,
    joinTeam: joinTeamReq,
    leaveTeam: leaveTeamReq,
    leadTeam: leadTeamReq
  }
}

export default Team;