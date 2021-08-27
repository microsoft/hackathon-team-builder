import React, { useState, useEffect } from 'react';
import { Message } from 'semantic-ui-react';
import { Button } from '@fluentui/react-northstar';
import { TeamsUserCredential } from "@microsoft/teamsfx";
import TeamList from './components/TeamList';
import CreateTeam from './components/CreateTeam';
import TeamListItem from './components/TeamListItem';
import GitHubUserEntry from './components/gituserentry-modal-hook';
import { HackAPIScope } from './apis/nh4h';
import gamification, { GameAPIScope } from './apis/gamification';
import User from './apis/user';
import Team from './apis/team';

function TeamBuilder() {
  const [user, setUser] = useState(new User());
  const [team, setTeam] = useState({});
  const [myTeam, setMyTeam] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [enableTeamBuilder, setEnableTeamBuilder] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [hackToken, setHackToken] = useState('');
  const [existingTeamNames, setExistingTeamNames] = useState([]);

  const teamClient = Team();
  const credential = new TeamsUserCredential();

  // Helper functions ----------------------------------------
  async function activityPoints(activityId) {
    let body = {
      UserEmail: email,
      ActivityId: activityId
    }
    let auth = await credential.getToken(GameAPIScope);
    let client = gamification(auth.token);
    // += TODO: Get activity name and show it to user! 
    await client.post("/useractivity/Points", body);
  }

  async function getTeams(authToken) {
    let teams = await teamClient.getAllTeams(authToken);
    setTeam({...team, allteams: teams});
    setExistingTeamNames(teams.map((t) => t.teamName));
    setMyTeam(teams.find((t) => t.id === user.myteam) ?? null);
  }

  async function CreateNewTeam(body) {
    body.createdBy = user.email;
    let newTeamId = await teamClient.createNewTeam(hackToken, body);
    setTeam({...team, teamid: newTeamId});

    await changeTeamMembership(true, newTeamId, body.teamName, 1, 1);
    setShowCreate(!showCreate);
    await getTeams(hackToken);
  }

  async function editTeam(body) {
    body.modifiedBy = user.email;
    await teamClient.editTeam(hackToken, user.myteam, body);

    setShowCreate(!showCreate);
    await getTeams(hackToken);
  }

  async function changeTeamMembership(join, id, name, isFromCreate = 0, islead = 0) {
    if (join) {
      // Activity Id for joining a team is 13
      await activityPoints(13);
    }

    await user.changeTeamMembership(hackToken, join, id, name, isFromCreate, islead);
    await user.getTeam(hackToken);
    setMyTeam(findTeam(user.myteam));
  }

  function toggleShowCreate() {
    setShowCreate(!showCreate);
  }

  async function saveGitUser(body) {
    body.UserId = user.userid;
    await user.saveGitUserId(hackToken, user.userid, body);
    setEnableTeamBuilder(true);
  }

  function findTeam(teamId) {
    if (!team.allteams) return null;
    let myTeamObj = team.allteams.find(obj => obj.id === teamId);
    return myTeamObj;
  }

  // End Helper Functions-------------------------------------

  useEffect(() => {
    const getUserInfo = async () => {
      //credential.login(HackAPIScope); // uncomment for user consent

      let tokenResp = await credential.getToken(HackAPIScope);
      setHackToken(tokenResp.token);

      let info = await credential.getUserInfo();
      user.email = info.preferredUserName; // usually email address
      setEmail(info.preferredUserName);
      setUsername(info.displayName)

      await user.getUserID(tokenResp.token);
      if (user.githubuser) {
        await user.getTeam(tokenResp.token);
        setEnableTeamBuilder(true);
        await getTeams(tokenResp.token);
      } else {
        setEnableTeamBuilder(false);
      }

    }; // End getUserInfo()   

    getUserInfo();

  }, []);  

  let buttonText = !showCreate ? 'Create a Team!' : 'Never Mind';

  if (!user.found) {
    return (
      <Message header='Contact Support!' content='User is not found or TeamBuilder API is down. Please ask for help in general channel.' />
    );
  } else if (enableTeamBuilder) {
    return (
      <div className="ui">
        <div id="TeamBuilder">
          {myTeam ?
            <div>
              <h2>Your Team </h2>
              <div className="ui special fluid">
                <TeamListItem Callback={changeTeamMembership} edit={toggleShowCreate}
                  islead={user.islead} team={myTeam} isTeamMember={true} />
              </div>
            </div>
            :
            <Button primary onClick={toggleShowCreate}>{buttonText}</Button>
          }
          {showCreate && 
            <CreateTeam activityPoints={activityPoints} teamNames={existingTeamNames} team={myTeam} createTeam={CreateNewTeam} editTeam={editTeam} cancel={toggleShowCreate} />
          }
          <br /><h2>All Teams</h2>
          <TeamList edit={toggleShowCreate} Callback={changeTeamMembership} myteam={myTeam} teams={team.allteams} islead={user.islead} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="ui">
        {user.githubuser ?
          <div class="ui active centered inline loader"></div> :
          <GitHubUserEntry saveGH={saveGitUser} userid={user.userid} activityPoints={activityPoints} Callback={getTeams} />
        }
      </div>
    );
  }
}

export default TeamBuilder;