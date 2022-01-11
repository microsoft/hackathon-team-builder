import React, { useState, useEffect } from 'react';
import { Message } from 'semantic-ui-react';
import { Button, Flex, Header,TeamCreateIcon } from '@fluentui/react-northstar';
import { TeamsUserCredential } from "@microsoft/teamsfx";
import TeamList from './components/TeamList';
import CreateTeam from './components/CreateTeam';
import TeamListItem from './components/TeamListItem';
import GitHubUserEntry from './components/gituserentry-modal-hook';
import gamification, { GameAPIScope } from './apis/gamification';
import User from './apis/user';
import Team from './apis/team';
import Challenge from './apis/challenge';
import {createTeamButtonText} from './components/Themes'

function TeamBuilder() {
  const [user, setUser] = useState(new User());
  const [teamList, setTeamList] = useState([]); // list of teams grouped by challenge
  const [myTeam, setMyTeam] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [enableTeamBuilder, setEnableTeamBuilder] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [hackToken, setHackToken] = useState('');
  const [existingTeamNames, setExistingTeamNames] = useState([]);
  const [challengeOptions, setChallengeOptions] = useState([]);

  const teamClient = Team();
  const credential = new TeamsUserCredential();

  // Helper functions ----------------------------------------
  async function activityPoints(activityId) {
    // let body = {
    //   UserEmail: email,
    //   ActivityId: activityId
    // }
    // let auth = await credential.getToken(GameAPIScope);
    // let client = gamification(auth.token);
    // += TODO: Get activity name and show it to user! 
    // Not required for this iteration
    // await client.post("/useractivity/Points", body);
  }

  async function getTeams(authToken, email) {
    let result = await teamClient.getAllTeams(authToken, email);
    setChallengeOptions(result.challenges);
    setTeamList(result.teams);
    setExistingTeamNames(result.teamnames.map((t) => t.name)); // used to prevent duplicate team names on create
    setMyTeam(result.myteams[0] ?? null)
    //setMyTeam(teams.find((t) => t.id === user.myteam) ?? null);
  }

  async function CreateNewTeam(input) {
    let newTeamId = await teamClient.createNewTeam(hackToken, input);
    await updateTeamMembership(true, email, newTeamId, true);
    setShowCreate(!showCreate);
  }

  async function editTeam(input) {
    await teamClient.editTeam(hackToken, input);
    setShowCreate(!showCreate);
    await getTeams(hackToken, email);
  }

  async function handleChangeTeamMembership(join, id, name, islead = false) {
    if (join) {
      // Activity Id for joining a team is 13
      await activityPoints(13);
    }

    await updateTeamMembership(join, email, id, islead);
  }

  async function handleLeadChange(id, name, islead) {
    let input = {
      teamId: id,
      userId: email,
      isLead: islead
    };
    await teamClient.leadTeam(hackToken, input);
    await getTeams(hackToken, email);
  }

  async function updateTeamMembership(join, userId, teamId, islead) {
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
    await getTeams(hackToken, email);
  }

  function toggleShowCreate() {
    setShowCreate(!showCreate);
  }

  async function saveGitUser(body) {
    // TODO: emit message to eventgrid
    body.UserId = user.userid;
    await user.saveGitUserId(hackToken, user.userid, body);
    await user.getUserID(hackToken);
    setEnableTeamBuilder(true);
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
      //user.email = info.preferredUserName; // usually email address
      setEmail(info.preferredUserName);
      setUsername(info.displayName)

      //await user.getUserID(tokenResp.token);
      //await user.getTeam(tokenResp.token);
      await getTeams(token, info.preferredUserName);

      // if (user.githubuser) {
      //   setEnableTeamBuilder(true);
      // } else {
      //   setEnableTeamBuilder(false);
      // }

    }; // End getUserInfo()   

    loadData();

  }, []);  

  let buttonText = !showCreate ? createTeamButtonText : 'Never Mind';

  // if (!user.found) {
  //   return (
  //     <Message header='Loading!' content='Team Builder is loading.  In the event that it does not load, please ask for help in the Technical Assistance channel.' />
  //   );
  // } else if (enableTeamBuilder) {
    return (
      <div className="ui">
        <div id="TeamBuilder">
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
            <CreateTeam activityPoints={activityPoints} teamNames={existingTeamNames} team={myTeam.team} createTeam={CreateNewTeam} editTeam={editTeam} cancel={toggleShowCreate} challengeOptions={challengeOptions} />
          }
          <br /><h2>All Teams</h2>
          <TeamList edit={toggleShowCreate} Callback={handleChangeTeamMembership} myteam={myTeam ? myTeam.team : null} teams={teamList} />
        </div>
      </div>
    );
  // } else {
  //   return (
  //     <div className="ui">
  //       {user.githubuser ?
  //         <div class="ui active centered inline loader"></div> : 
  //         <GitHubUserEntry saveGH={saveGitUser} userid={user.userid} activityPoints={activityPoints} />
  //       }
  //     </div>
  //   );
  // }
}

export default TeamBuilder;