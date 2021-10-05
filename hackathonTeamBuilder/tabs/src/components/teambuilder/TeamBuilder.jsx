import React, { useState, useEffect } from 'react';
import { Message } from 'semantic-ui-react';
import { Button, Loader, Flex, Header,TeamCreateIcon, Dialog,Form, FormInput, FormCheckbox, FormButton, FormField, Input,Label,Menu,Dropdown  } from '@fluentui/react-northstar';
import { TeamsUserCredential } from "@microsoft/teamsfx";
import TeamList from './components/TeamList';
import CreateTeam from './components/CreateTeam';
import TeamListItem from './components/TeamListItem';
import GitHubUserEntry from './components/gituserentry-modal-hook';
import { HackAPIScope } from './apis/nh4h';
import gamification, { GameAPIScope } from './apis/gamification';
import User from './apis/user';
import Team from './apis/team';
import Challenge from './apis/challenge';
import {createTeamButtonText} from './components/Themes'
import { SearchIcon, ExclamationCircleIcon } from '@fluentui/react-icons-northstar'
import {
  getTheme,
  mergeStyleSets,
  FontWeights,
  ContextualMenu,
  Toggle,
  Modal,
  IDragOptions,
  IIconProps,
  Stack,
  IStackProps,
} from '@fluentui/react';
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
  const [challengeOptions, setChallengeOptions] = useState([]);

  const teamClient = Team();
  const challengeClient = Challenge();
  const credential = new TeamsUserCredential();


  const placeholdertxt = "Select your user id";
  const letsgo = () => {
    let user = document.getElementById("selected-user").querySelectorAll('[aria-atomic="true"]')[0].innerText;
  
    var letsgobutton = document.getElementById("letsgo");
    letsgobutton.className = "ui positive button active";
  };

  // Helper functions ----------------------------------------
  async function activityPoints(activityId) {
    let body = {
      UserEmail: email,
      ActivityId: activityId
    }
    let auth = await credential.getToken(GameAPIScope);
    let client = gamification(auth.token);
    // += TODO: Get activity name and show it to user! 
    // Not required for this iteration
    // await client.post("/useractivity/Points", body);
  }

  async function getTeams(authToken) {
    try {
      let teams = await teamClient.getAllTeams(authToken);
      setTeam({...team, allteams: teams});
      setExistingTeamNames(teams.map((t) => t.teamName));
      setMyTeam(teams.find((t) => t.id === user.myteam) ?? null);
    } catch (error) {
      console.error(error);
    }

  }

  async function fetchChallengeOptions(authToken) {
    try {
      let items = await challengeClient.getAllChallenges(authToken);
      setChallengeOptions(items);
    } catch (error) {
      console.error(error);
    }
  }

  async function CreateNewTeam(body) {
    try {
      body.createdBy = user.email;
      let newTeamId = await teamClient.createNewTeam(hackToken, body);
      setTeam({...team, teamid: newTeamId});
      await updateTeamMembership(true, newTeamId, body.teamName, 1, 1);
    } catch (error) {
      console.error(error);
    }

    // Even if create calls fail, try to update the UI
    setShowCreate(!showCreate);
    await getTeams(hackToken);
  }

  async function editTeam(body) {
    try {
      body.modifiedBy = user.email;
      await teamClient.editTeam(hackToken, user.myteam, body);
    } catch (error) {
      console.error(error);
    }

    // Try to update UI even if edit call fails
    setShowCreate(!showCreate);
    await getTeams(hackToken);
  }

  async function handleChangeTeamMembership(join, id, name, isFromCreate = 0, islead = 0) {
    if (join) {
      // Activity Id for joining a team is 13
      await activityPoints(13);
    }

    await updateTeamMembership(join, id, name, isFromCreate, islead);
  }

  async function handleLeadChange(id, name, islead) {
    await updateTeamMembership(true, id, name, 0, islead);
  }

  async function updateTeamMembership(join, id, name, isCreate, islead) {
    try {
      await user.changeTeamMembership(hackToken, join, id, name, isCreate, islead);
    } catch (error) {
      console.error(error);
    }

    // Try to update UI even if membership call fails
    await user.getTeam(hackToken);
    await getTeams(hackToken);
  }

  function toggleShowCreate() {
    setShowCreate(!showCreate);
  }

  async function saveGitUser(body) {
    try {
      body.UserId = user.userid;
      await user.saveGitUserId(hackToken, user.userid, body);
      await user.getUserID(hackToken);
      setEnableTeamBuilder(true);
    } catch (error) {
      console.error(error);
    }
  }

  // End Helper Functions-------------------------------------

  useEffect(() => {
    const loadData = async () => {
      //credential.login(HackAPIScope); // uncomment for user consent

      let tokenResp = await credential.getToken(HackAPIScope);
      setHackToken(tokenResp.token);

      await fetchChallengeOptions(tokenResp.token);

      let info = await credential.getUserInfo();
      user.email = info.preferredUserName; // usually email address
      setEmail(info.preferredUserName);
      setUsername(info.displayName)

      await user.getUserID(tokenResp.token);
      await user.getTeam(tokenResp.token);
      await getTeams(tokenResp.token);

      if (user.githubuser) {
        setEnableTeamBuilder(true);
      } else {
        setEnableTeamBuilder(false);
      }

    }; // End getUserInfo()   

    loadData();

  }, []);  

  let buttonText = !showCreate ? createTeamButtonText : 'Never Mind';

  if (!user.found) {
    return (
      <Message header='Loading!' content='Team Builder is loading.  In the event that it does not load, please ask for help in the Technical Assistance channel.' />
    );
  } else if (enableTeamBuilder) {
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
                  islead={user.islead} team={myTeam} isTeamMember={true} onLeadChange={handleLeadChange} />
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
            <CreateTeam activityPoints={activityPoints} teamNames={existingTeamNames} team={myTeam} createTeam={CreateNewTeam} editTeam={editTeam} cancel={toggleShowCreate} challengeOptions={challengeOptions} />
          }
          <br /><h2>All Teams</h2>
          <TeamList edit={toggleShowCreate} Callback={handleChangeTeamMembership} myteam={myTeam} teams={team.allteams} challengeOptions={challengeOptions} islead={user.islead} />
        </div>
      </div>
    );
  } else {
    return (
      <div className="ui">
        {user.githubuser ?
          <div class="ui active centered inline loader"></div> : 
          <GitHubUserEntry saveGH={saveGitUser} userid={user.userid} activityPoints={activityPoints} />
        }
      </div>
    );
  }
}

export default TeamBuilder;