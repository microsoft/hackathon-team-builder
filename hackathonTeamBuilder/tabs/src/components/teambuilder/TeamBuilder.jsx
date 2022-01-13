import React, { useState, useEffect } from 'react';
import { Button, Flex, Header,TeamCreateIcon, Loader } from '@fluentui/react-northstar';
import { TeamsUserCredential } from "@microsoft/teamsfx";
import TeamList from './components/TeamList';
import CreateTeam from './components/CreateTeam';
import TeamListItem from './components/TeamListItem';
import Team from './apis/team';
import {createTeamButtonText} from './components/Themes'

function TeamBuilder() {
  const [teamList, setTeamList] = useState([]); // list of teams grouped by challenge
  const [myTeam, setMyTeam] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [hackToken, setHackToken] = useState('');
  const [existingTeamNames, setExistingTeamNames] = useState([]);
  const [challengeOptions, setChallengeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState('');

  const teamClient = Team();
  const credential = new TeamsUserCredential();

  // Helper functions ----------------------------------------
  
  async function getTeams(authToken, userId) {
    let result = await teamClient.getAllTeams(authToken, userId);
    setChallengeOptions(result.challenges);
    setTeamList(result.teams);
    setExistingTeamNames(result.teamnames.map((t) => t.name)); // used to prevent duplicate team names on create
    setMyTeam(result.myteams[0] ?? null)
    setIsLoading(false);
  }

  async function CreateNewTeam(input) {
    let newTeamId = await teamClient.createNewTeam(hackToken, input);
    await updateTeamMembership(true, userId, newTeamId, true);
    setShowCreate(!showCreate);
  }

  async function editTeam(input) {
    await teamClient.editTeam(hackToken, input);
    setShowCreate(!showCreate);
    await getTeams(hackToken, userId);
  }

  async function handleChangeTeamMembership(join, id, name, islead = false) {    
    await updateTeamMembership(join, userId, id, islead);
  }

  async function handleLeadChange(id, name, islead) {
    setIsLoading(true);
    let input = {
      teamId: id,
      userId: userId,
      isLead: islead
    };
    await teamClient.leadTeam(hackToken, input);
    await getTeams(hackToken, userId);
  }

  async function updateTeamMembership(join, userId, teamId, islead) {
    setIsLoading(true);
    let input = {
      teamId: teamId,
      userId: userId
    };
    if (join) {
      input.isLead = islead;
      await teamClient.joinTeam(hackToken, input);
    }
    else {
      await teamClient.leaveTeam(hackToken, input);
    }
    await getTeams(hackToken, userId);
  }

  function toggleShowCreate() {
    setShowCreate(!showCreate);
  }

  // End Helper Functions-------------------------------------

  useEffect(() => {
    const loadData = async () => {
      //credential.login(HackAPIScope); // uncomment for user consent
      //let tokenResp = await credential.getToken(HackAPIScope);
      let token = 'abcdefg';
      //setHackToken(tokenResp.token);
      setHackToken(token);

      // get info from current user
      let info = await credential.getUserInfo();
      setUserId(info.objectId);

      await getTeams(token, info.objectId);
    }; // End getUserInfo()   

    loadData();

  }, []);  

  let buttonText = !showCreate ? createTeamButtonText : 'Never Mind';

    return (
      <div className="ui">
        <div id="TeamBuilder">
          {isLoading &&
            <div className="fullscreen">
              <Loader label="Loading data..." />
            </div>
          }
          {myTeam ?
          <Flex gap="gap.medium" padding="padding.medium" debug style={{ minHeight: 130, }}>
          <Flex.Item >
            <div>
            <Header as="h3" content="Your Team" />
              <div className="ui special fluid">
                <TeamListItem Callback={handleChangeTeamMembership} edit={toggleShowCreate}
                  islead={myTeam.isLead} team={myTeam.team} isTeamMember={true} onLeadChange={handleLeadChange} />
              </div>
            </div>
            </Flex.Item>
            </Flex>
            :
            <div > 
              <Flex gap="gap.medium" padding="padding.large">
                    <Flex.Item size="size.half">
                      <div>
                    <br></br>
                    <br></br>
                    <Button icon={<TeamCreateIcon />}  fluid loader="Generate interface" primary onClick={toggleShowCreate}>{buttonText}</Button>
                    </div>
                    </Flex.Item>
                  </Flex>
            </div>
          }
          {showCreate && 
            <CreateTeam teamNames={existingTeamNames} team={myTeam ? myTeam.team : null} createTeam={CreateNewTeam} editTeam={editTeam} cancel={toggleShowCreate} challengeOptions={challengeOptions} />
          }
          <br /><h2>All Teams</h2>
          <TeamList edit={toggleShowCreate} Callback={handleChangeTeamMembership} myteam={myTeam ? myTeam.team : null} teams={teamList} />
        </div>
      </div>
    );
}

export default TeamBuilder;