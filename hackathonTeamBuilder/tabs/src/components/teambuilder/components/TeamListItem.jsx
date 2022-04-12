import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Card,
  Flex,
  Header,
  Label,
  Text,
} from "@fluentui/react-northstar";
import {
  noMemberFound,
  leadButtonText,
  dontLeadButtonText,
  editButtonText,
  joinButtonText,
  leaveButtonText,
} from "./Themes";
import { useSettings } from '../hooks/settings';

function TeamListItem(props) {
  const [team, setTeam] = useState(null);
  const [enableJoin, setEnableJoin] = useState(true);
  const appSettings = useSettings();

  useEffect(() => {
    if (props.team) {
      setTeam(props.team);

      if (appSettings && appSettings.maxTeamSize > 0 && props.team.members.length > appSettings.maxTeamSize) {
        setEnableJoin(false);
      }
    }
  }, [props.team, appSettings]);

  function getHackers() {
    return (
      <Flex gap="gap.small">
        {team.members
          .filter((m) => !m.isLead)
          .map((m, idx) => <Avatar key={idx} name={m.user.fullName} />)
        }
      </Flex>
    );
  }

  function getTeamLeads() {
    return (
      <Flex gap="gap.small">
        {team.members
          .filter((m) => m.isLead)
          .map((m, idx) => (
            <Avatar
              key={idx}
              name={m.user.fullName + " (Lead)"}
              status={{
                color: "lightblue",
              }}
            />
          ))}
      </Flex>
    );
  }

  function JoinButton({ onClick }) {
    return (
      <Button
        aria-label="Join Team Button"
        disabled={!enableJoin}
        onClick={() => {
          onClick(
            // handleChangeTeamMembership(join, id, name, islead = false)
            true,
            team.id,
            team.name
          );
        }}
      >
        {joinButtonText}
      </Button>
    );
  }

  function LeaveButton({ onClick }) {
    return (
      <Button
        primary
        aria-label={leaveButtonText}
        onClick={() => {
          onClick(
            // handleChangeTeamMembership(join, id, name, islead = false)
            false,
            team.id,
            team.name
          );
        }}
      >
        {leaveButtonText}
      </Button>
    );
  }

  function EditButton({ onClick }) {
    return (
      <Button aria-label="Edit Team Button" onClick={onClick}>
        {editButtonText}
      </Button>
    );
  }

  function LeadButton({ isTeamMember, isLead, onClick }) {
    return (
      <Button
        aria-label="Lead Button"
        onClick={() => {
          onClick(team.id, team.name, true);
        }}
      >
        {leadButtonText}
      </Button>
    );
  }

  function DontLeadButton({ isLead, onClick }) {
    return (
      <Button
        primary
        aria-label="Don't Lead Button"
        onClick={() => {
          onClick(team.id, team.name, false);
        }}
      >
        {dontLeadButtonText}
      </Button>
    );
  }

  return (
    team && (
      <Card fluid key={team.id}>
        <Card.Header>
          <Flex gap="gap.small" column>
            <Header as="h3" content={team.name} />
            <Text content={team.description} />
          </Flex>
        </Card.Header>
        <Card.Body>
          <Flex gap="gap.small" fluid>
            <Flex column gap="gap.small">
              <Text weight="bold" content="Team Leaders: " />
              {getTeamLeads()}
            </Flex>
            <Flex.Item push>
              <Flex column gap="gap.small">
                <Text weight="bold" content="Team Members: " />
                {getHackers()}
              </Flex>
            </Flex.Item>
          </Flex>
        </Card.Body>
        <Card.Footer>
          <Flex gap="gap.small">
            {props.showAllButtons ? ( // if showAllButtons === true
              props.isTeamMember ? (
                <Flex gap="gap.small">
                  <LeaveButton onClick={props.Callback} />
                  <EditButton onClick={props.edit} />
                  {props.isLead ? (
                    <DontLeadButton onClick={props.onLeadChange} />
                  ) : (
                    <LeadButton onClick={props.onLeadChange} />
                  )}
                </Flex>
              ) : (
                <JoinButton onClick={props.Callback} />
              )
            ) : // else show only join/leave buttons
            props.hasTeam ? (
              <></>
            ) : props.isTeamMember ? (
              <LeaveButton onClick={props.Callback} />
            ) : (
              <JoinButton onClick={props.Callback} />
            )}
          </Flex>
        </Card.Footer>
      </Card>
    )
  );
}

export default TeamListItem;
