import React from "react";
import {
  Button, Flex, Header, Text, Label, mergeThemes, teamsTheme, Provider
} from '@fluentui/react-northstar';

function TeamListItem(props) {
  // Theme overrides --------------------------------------------
  const dontLeadButton = {
    siteVariables: {
      colorScheme: {
        brand: {
          'background': 'darkorange',
        }
      }
    }
  }

  const leadButton = {
    siteVariables: {
      colorScheme: {
        brand: {
          'background': 'green',
        }
      }
    }
  }
  
  const editButton = {
    siteVariables: {
      colorScheme: {
        brand: {
          'background': 'darkblue',
        }
      }
    }
  }
  // End Theme overrides -----------------------------------------

  const team = props.team;
  const hackers = [];

  if (team) {
    if (team.Users.hackers.length === 0) {
      hackers.push(
        <Label>
          No Members or Lead
        </Label>
      )
    } else {
      props.team.Users.hackers.forEach(user => (
        hackers.push(
          <span key={user}>
            <Label color={user.islead ? "orange" : "green"} content={user.name} />&nbsp;
          </span>
        )
      ))
    }
  }
 
  return (
      <Flex gap="gap.medium" padding="padding.medium" debug style={{ minHeight: 130, }}>
        <Flex.Item size="size.quarter">
          <div style={{ position: 'relative', }} >
            <Header as="h3" content={team.teamName} />
            <Text content={team.teamDescription} />
          </div>
        </Flex.Item>
        <Flex.Item>
          <Flex gap="gap.medium" padding="padding.medium">
            <div style={{ position: 'relative', }}>
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
                      Join
                    </Button>
                  </Flex>
                ) : (
                  <br></br>
                )
              ) : (

                <Flex gap="gap.medium" padding="padding.medium">
                  <Provider theme={mergeThemes(teamsTheme, dontLeadButton)}>
                    <Button primary
                      onClick={() => {
                        props.Callback(
                          false,
                          team.id,
                          team.teamName
                        );
                      }}
                    >
                      Leave
                    </Button>
                  </Provider>
                  <Provider theme={mergeThemes(teamsTheme, editButton)}>
                    <Button primary
                      onClick={() => {
                        props.edit()

                      }}
                    >
                      Edit
                    </Button>
                  </Provider>
                  {
                    props.islead ? (
                      <Flex gap="gap.medium" padding="padding.medium">
                        <Provider theme={mergeThemes(teamsTheme, dontLeadButton)}>
                          <Button primary
                            onClick={() => {
                              props.Callback(
                                true,
                                team.id,
                                team.teamName,
                                0,
                                1
                              );
                            }}
                          >
                            Don't Lead
                          </Button>
                        </Provider>
                      </Flex>
                    ) : (
                      <Provider theme={mergeThemes(teamsTheme, leadButton)}>
                        <Button primary
                          onClick={() => {
                            props.Callback(
                              true,
                              team.id,
                              team.teamName,
                              0,
                              1
                            );
                          }}
                        >
                          Lead
                        </Button>
                      </Provider>
                    )
                  }
                </Flex>
              )
              }
            </div>
          </Flex>
        </Flex.Item>
      </Flex>
    // <Card fluid>
    //   <Card.Content floated="left" header>
    //     <Header
    //       size="large"
    //       content={props.team.teamName}
    //       subheader={props.team.msTeamsChannel}
    //     ></Header>
    //   </Card.Content>
    //   <Card.Content description>
    //     <Header as="h3" floated="left">
    //       Description
    //     </Header>
    //     <Divider clearing />
    //     <p>{props.team.teamDescription}</p>
    //   </Card.Content>
    //   <Card.Content extra>
    //     {!props.isTeamMember ? (
    //       !props.hasTeam ? (
    //         <div>

    //           <Button
    //             size="mini"
    //             floated="right"
    //             basic
    //             color="green"
    //             onClick={() => {
    //               props.Callback(
    //                 true,
    //                 props.team.id,
    //                 props.team.teamName
    //               );
    //             }}
    //           >
    //             Join
    //           </Button>
    //           <Icon name='user' aria-label="Members:" /> {hackers}
    //         </div>
    //       ) : (
    //         <div>
    //           <Icon name='user' aria-label="Members:" /> {hackers}
    //         </div>
    //       )
    //     ) : (
    //       <div>
    //         <Button
    //           size="mini"
    //           floated="right"
    //           basic
    //           color="red"
    //           onClick={() => {
    //             props.Callback(
    //               false,
    //               props.team.id,
    //               props.team.teamName
    //             );
    //           }}
    //         >
    //           Leave
    //         </Button>
    //         <Button
    //           size="mini"
    //           floated="right"
    //           basic
    //           color="blue"
    //           onClick={() => {
    //             props.edit();
    //           }}
    //         >
    //           Edit
    //         </Button>
    //         {islead ? (

    //           <Button
    //             size="mini"
    //             floated="right"
    //             color="red"
    //             onClick={() => {
    //               props.Callback(
    //                 true,
    //                 props.team.id,
    //                 props.team.teamName,
    //                 0,
    //                 0
    //               );
    //             }}
    //             icon
    //           >
    //             <Icon name="heart" />
    //             Don't Lead
    //           </Button>
    //         ) : (
    //           <Button
    //             size="mini"
    //             floated="right"
    //             color="green"
    //             onClick={() => {
    //               props.Callback(
    //                 true,
    //                 props.team.id,
    //                 props.team.teamName,
    //                 0,
    //                 1
    //               );
    //             }}
    //             icon
    //           >
    //             <Icon name="heart" />
    //             Lead
    //           </Button>
    //         )}
    //         <Icon name='user' aria-label="Members:" /> {hackers}
    //       </div>
    //     )}

    //   </Card.Content>
    // </Card>
  );

}

export default TeamListItem;
