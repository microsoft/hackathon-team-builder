import React from "react";
import {
  Button, Flex, Header, Text, Label, mergeThemes, teamsTheme, Provider
} from '@fluentui/react-northstar';
import {dontLeadButton, leadButton, editButton,noMemberFound,colorLead,colorMember,leadButtonText,dontLeadButtonText,editButtonText, joinButtonText,leaveButtonText} from './Themes'
function TeamListItem(props) {
 

  const team = props.team;
  const hackers = [];

  if (team) {
    if (team.Users.hackers.length === 0) {
      hackers.push(
        <Label>
          {noMemberFound}
        </Label>
      )
    } else {
      props.team.Users.hackers.forEach(user => (
        hackers.push(
          
          <span key={user}>
            <Label color={user.islead ? colorLead : colorMember} content={user.name} />&nbsp;
          </span>
        )
      ))
    }
  }
 
  return (
      <Flex gap="gap.medium" padding="padding.medium" debug style={{ minHeight: 130, }}>
        <Flex.Item >
          <div style={{ position: 'relative', }} >
            <Header as="h3" content={team.teamName} />
            <Text content={team.teamDescription} />
            <Header as="h4" content={team.msTeamsChannel} />
              { hackers }
              {!props.isTeamMember ? (
                !props.hasTeam ? (
                  <Flex gap="gap.medium" padding="padding.medium">
                    <Button primary
                      onClick={() => {
                        props.Callback(
                          true,
                          team.id,
                          team.teamName
                        );
                      }}
                    >
                      {joinButtonText}
                    </Button>
                  </Flex>
                ) : (
                  <br></br>
                )
              ) : (

                <Flex gap="gap.medium" padding="padding.medium">
                  <Provider theme={mergeThemes(teamsTheme, dontLeadButton)}>
                    <Button  primary
                      onClick={() => {
                        props.Callback(
                          false,
                          team.id,
                          team.teamName
                        );
                      }}
                    >
                      {leaveButtonText}
                    </Button>
                  </Provider>
                  <Provider theme={mergeThemes(teamsTheme, editButton)}>
                    <Button primary
                      onClick={() => {
                        props.edit()

                      }}
                    >
                      {editButtonText}
                    </Button>
                  </Provider>
                  {
                    props.islead ? (
                        <Provider theme={mergeThemes(teamsTheme, dontLeadButton)}>
                          <Button primary
                            onClick={() => {
                              props.onLeadChange(
                                team.id,
                                team.teamName,
                                0
                              );
                            }}
                          >
                            {dontLeadButtonText}
                          </Button>
                        </Provider>
                    ) : (
                      <Provider theme={mergeThemes(teamsTheme, leadButton)}>
                        <Button primary
                          onClick={() => {
                            props.onLeadChange(
                              team.id,
                              team.teamName,
                              1
                            );
                          }}
                        >
                          {leadButtonText}
                        </Button>
                      </Provider>
                    )
                  }
                </Flex>
              )
              }
          </div>
        </Flex.Item>
        
     
      </Flex>
  );

}

export default TeamListItem;
