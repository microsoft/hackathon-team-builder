import React, { useState, useEffect } from "react";
import {
  AcceptIcon,
  Avatar,
  Button,
  Card,
  Flex,
  Header,
  Label,
  PresenterIcon,
  Text,
} from "@fluentui/react-northstar";
import {
  noMemberFound,
  colorLead,
  colorMember,
  leadButtonText,
  dontLeadButtonText,
  editButtonText,
  joinButtonText,
  leaveButtonText,
} from "./Themes";

function TeamListItem(props) {
  const [team, setTeam] = useState(null);

  useEffect(() => {
    if (props.team) {
      setTeam(props.team);
    }
  }, [props.team]);

  function getHackers() {
    return team.members.length === 0 ? (
      <Label>{noMemberFound}</Label>
    ) : (
      team.members.map((m, idx) => (
        (m.isLead) ?
        <Avatar key={idx} 
          name={m.user.fullName}
          icon={<PresenterIcon />}
           />
           :
           <Avatar key={idx}
           name={m.user.fullName}
           />
        // <Label
        //   key={idx}
        //   color={m.isLead ? colorLead : colorMember}
        //   content={m.isLead ? m.user.fullName + " (Lead)" : m.user.fullName}
        // />
      ))
    );
  }

  function JoinButton({ onClick }) {
    return (
      <Button
        aria-label="Join Team Button"
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
          <Text weight="bold" content="Team Members: " />
          <Flex.Item>
            <Flex gap="gap.smaller">{getHackers()}</Flex>
          </Flex.Item>
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
            props.isTeamMember ? (
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
