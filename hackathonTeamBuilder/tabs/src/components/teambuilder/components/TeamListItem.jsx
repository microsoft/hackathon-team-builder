import React from "react";
import {
  Button, Flex, Header, Text, Label, mergeThemes, teamsTheme, Provider
} from '@fluentui/react-northstar';
import {dontLeadButton, leadButton, editButton,noMemberFound,colorLead,colorMember,leadButtonText,dontLeadButtonText,editButtonText, joinButtonText,leaveButtonText} from './Themes'
function TeamListItem(props) {
 

  const team = props.team;
  const hackers = [];

  if (team) {
    if (team.members.length === 0) {
      hackers.push(
        <Label>
          {noMemberFound}
        </Label>
      )
    } else {
      team.members.forEach(m => (
        hackers.push(          
          <span key={m}>
            <Label color={m.islead ? colorLead : colorMember} content={m.islead ? m.user.fullName + " (Lead)" : m.user.fullName} />&nbsp;
          </span>
        )
      ))
    }
  }
 
  return (
      <Flex gap="gap.medium" padding="padding.medium" debug style={{ minHeight: 130, }}>
        <Flex.Item >
          <div style={{ position: 'relative', }} >
            <Header as="h3" content={team.name} />
            <Text content={team.description} />
            <br />
            <br />
            {/* <Text weight="bold" content="Teams Channel: " /><Text content={team.msTeamsChannelName} /> */}
            <br />
            <Text weight="bold" content="Team Members: " />
            <br />
              { hackers }
              {!props.isTeamMember ? (
                !props.hasTeam ? (
                  <Flex gap="gap.medium" padding="padding.medium">
                    <Button primary
                      onClick={() => {
                        props.Callback( // handleChangeTeamMembership(join, id, name, islead = false)
                          true,
                          team.id,
                          team.name
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
                        props.Callback( // handleChangeTeamMembership(join, id, name, islead = false)
                          false,
                          team.id,
                          team.name
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
                                team.name,
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
                              team.name,
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
