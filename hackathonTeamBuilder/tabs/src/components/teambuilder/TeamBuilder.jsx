import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Header,
  TeamCreateIcon,
  Loader,
} from "@fluentui/react-northstar";
import { TeamsFx } from "@microsoft/teamsfx";
import { useTeams } from "msteams-react-base-component";
import TeamList from "./components/TeamList";
import CreateTeam from "./components/CreateTeam";
import EditTeam from "./components/EditTeam";
import TeamListItem from "./components/TeamListItem";
import Team from "./apis/team";
import { useSettings } from "./hooks/settings";
import { useCreateChannel } from "./hooks/createChannel";
import { createTeamButtonText } from "./components/Themes";

function TeamBuilder() {
  const [teamList, setTeamList] = useState([]); // list of teams grouped by challenge
  const [myTeam, setMyTeam] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [existingTeamNames, setExistingTeamNames] = useState([]);
  const [challengeOptions, setChallengeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [enableCreateChannel, setEnableCreateChannel] = useState(false);

  const teamClient = Team();
  const teamsFx = new TeamsFx();
  const [{ context }] = useTeams();

  const createChannel = useCreateChannel();
  const appSettings = useSettings();
  // Helper functions ----------------------------------------

  useEffect(() => {
    if (appSettings)
        setEnableCreateChannel(appSettings.useTeams);
  }, [appSettings]);

  async function getTeams(userId) {
    await teamClient.getAllTeams.request(userId);
  }

  useEffect(() => {
    if (teamClient.getAllTeams.data) {
      let result = teamClient.getAllTeams.data;
      setChallengeOptions(result.challenges);
      setTeamList(result.teams);
      setExistingTeamNames(result.teamnames.map((t) => t.name)); // used to prevent duplicate team names on create
      setMyTeam(result.myteams[0] ?? null);
      setIsLoading(false);
    }
  }, [teamClient.getAllTeams.data]);

  async function CreateNewTeam(input) {
    try {
      let channelId;
      if (enableCreateChannel) {
        let result = await createChannel(context.groupId, {
          displayName: input.name,
          description: input.description,
          membershipType: "standard",
        });
        channelId = result.webUrl;
      }
      await teamClient.createNewTeam.request({ channelId, ...input });
    } catch (err) {
      // add error handling
      console.log(err);
    }
    setShowCreate(!showCreate);
  }

  useEffect(() => {
    if (teamClient.createNewTeam.data) {
      let newTeamId = teamClient.createNewTeam.data.addTeam.team.id;
      updateTeamMembership(true, userId, newTeamId, true);
    }
  }, [teamClient.createNewTeam.data]);

  async function editTeam(input) {
    await teamClient.editTeam.request(input);
    setShowCreate(!showCreate);
    await getTeams(userId);
  }

  async function handleChangeTeamMembership(join, id, name, isLead = false) {
    await updateTeamMembership(join, userId, id, isLead);
  }

  async function handleLeadChange(id, name, isLead) {
    setIsLoading(true);
    let input = {
      teamId: id,
      userId: userId,
      isLead: isLead,
    };
    await teamClient.leadTeam.request(input);
    await getTeams(userId);
  }

  async function updateTeamMembership(join, userId, teamId, isLead) {
    setIsLoading(true);
    let input = {
      teamId: teamId,
      userId: userId,
    };
    if (join) {
      input.isLead = isLead;
      await teamClient.joinTeam.request(input);
    } else {
      await teamClient.leaveTeam.request(input);
    }
    await getTeams(userId);
  }

  function toggleShowCreate() {
    setShowCreate(!showCreate);
  }

  // End Helper Functions-------------------------------------

  useEffect(() => {
    const loadData = async () => {      
      // get info from current user
      let info = await teamsFx.getUserInfo();
      setUserId(info.objectId);

      await getTeams(info.objectId);
    }; // End getUserInfo()

    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let buttonText = !showCreate ? createTeamButtonText : "Never Mind";

  return (
    <Flex column fluid>
      <div id="TeamBuilder">
        {isLoading && (
          <div className="fullscreen">
            <Loader label="Loading data..." />
          </div>
        )}
        {myTeam && !showCreate ? (
          <Flex column gap="gap.medium" padding="padding.medium">
            <Header as="h1">Your Team</Header>
            <TeamListItem
              Callback={handleChangeTeamMembership}
              edit={toggleShowCreate}
              isLead={myTeam.isLead}
              team={myTeam.team}
              isTeamMember={true}
              showAllButtons
              onLeadChange={handleLeadChange}
            />
          </Flex>
        ) : (
          <Flex gap="gap.medium" padding="padding.large">
            <Flex.Item size="size.half">
              <Button
                icon={<TeamCreateIcon />}
                primary
                onClick={toggleShowCreate}
                aria-label="Create Team or Cancel Create Team Button"
              >
                {buttonText}
              </Button>
            </Flex.Item>
          </Flex>
        )}
        {showCreate && !myTeam && (
          <Flex gap="gap.medium" padding="padding.medium">
            <CreateTeam
              teamNames={existingTeamNames}
              team={myTeam ? myTeam.team : null}
              createTeam={CreateNewTeam}
              editTeam={editTeam}
              cancel={toggleShowCreate}
              challengeOptions={challengeOptions}
            />
          </Flex>
        )}
        {showCreate && myTeam && (
          <Flex gap="gap.medium" padding="padding.medium">
            <EditTeam
              teamNames={existingTeamNames}
              team={myTeam.team}
              editTeam={editTeam}
              cancel={toggleShowCreate}
              challengeOptions={challengeOptions}
            />
          </Flex>
        )}
        <hr />
        <Flex column gap="gap.medium" padding="padding.medium">
          <Header as="h1">All Teams</Header>
          <TeamList
            edit={toggleShowCreate}
            Callback={handleChangeTeamMembership}
            myteam={myTeam ? myTeam.team.id : null}
            teams={teamList}
          />
        </Flex>
      </div>
    </Flex>
  );
}

export default TeamBuilder;
