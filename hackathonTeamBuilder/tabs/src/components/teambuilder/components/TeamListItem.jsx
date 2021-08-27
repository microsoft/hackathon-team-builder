import React from "react";
import {
  Card,
  Button,
  Icon,
  Label,
  Header,
  Divider
} from "semantic-ui-react";

function TeamListItem(props) {

  const hackers = [];
  if (props.team) {
    if (props.team.Users.hackers.length === 0) {
      hackers.push(
        <Label>
          No Members or Lead
        </Label>
      )
    }
    for (let user of props.team.Users.hackers) {

      if (user.islead === 1) {
        hackers.push(
          <Label color="green" key={user.name}>
            {user.name}
            <Label.Detail>Lead</Label.Detail>
          </Label>
        );
      } else {
        hackers.push(
          <Label color="blue" key={user.name}>
            {user.name}
            <Label.Detail>Member</Label.Detail>
          </Label>
        );
      }
    }
  }
  let islead = props.islead ? props.islead === 1 : false;
  if (!props.team) {
    return "";
  }
  return (
    <Card fluid>
      <Card.Content floated="left" header>
        <Header
          size="large"
          content={props.team.teamName}
          subheader={props.team.msTeamsChannel}
        ></Header>
      </Card.Content>
      <Card.Content description>
        <Header as="h3" floated="left">
          Description
        </Header>
        <Divider clearing />
        <p>{props.team.teamDescription}</p>
      </Card.Content>
      <Card.Content extra>
        {!props.isTeamMember ? (
          !props.hasTeam ? (
            <div>

              <Button
                size="mini"
                floated="right"
                basic
                color="green"
                onClick={() => {
                  props.Callback(
                    true,
                    props.team.id,
                    props.team.teamName
                  );
                }}
              >
                Join
              </Button>
              <Icon name='user' aria-label="Members:" /> {hackers}
            </div>
          ) : (
            <div>
              <Icon name='user' aria-label="Members:" /> {hackers}
            </div>
          )
        ) : (
          <div>
            <Button
              size="mini"
              floated="right"
              basic
              color="red"
              onClick={() => {
                props.Callback(
                  false,
                  props.team.id,
                  props.team.teamName
                );
              }}
            >
              Leave
            </Button>
            <Button
              size="mini"
              floated="right"
              basic
              color="blue"
              onClick={() => {
                props.edit();
              }}
            >
              Edit
            </Button>
            {islead ? (

              <Button
                size="mini"
                floated="right"
                color="red"
                onClick={() => {
                  props.Callback(
                    true,
                    props.team.id,
                    props.team.teamName,
                    0,
                    0
                  );
                }}
                icon
              >
                <Icon name="heart" />
                Don't Lead
              </Button>
            ) : (
              <Button
                size="mini"
                floated="right"
                color="green"
                onClick={() => {
                  props.Callback(
                    true,
                    props.team.id,
                    props.team.teamName,
                    0,
                    1
                  );
                }}
                icon
              >
                <Icon name="heart" />
                Lead
              </Button>
            )}
            <Icon name='user' aria-label="Members:" /> {hackers}
          </div>
        )}

      </Card.Content>
    </Card>
  );

}

export default TeamListItem;