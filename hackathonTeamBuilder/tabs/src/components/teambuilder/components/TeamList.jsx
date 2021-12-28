import React, { useState, useEffect } from 'react';
import { Accordion } from '@fluentui/react-northstar';
import TeamListItem from './TeamListItem';
var _ = require('agile');

function TeamsList(props) {

  const [teams, setTeams] = useState([]);

  useEffect(() => {
    if (props.teams) {      
      setTeams(props.teams);
    }
  }, [props.teams]);

  // useEffect(() => {
  //   if (props.challengeOptions) {
  //     setChallenges(props.challengeOptions);
  //   }
  // }, [props.challengeOptions]);

  function joinOrLeaveTeam(type, id, name, isCreate, islead) {
    props.Callback(type, id, name, isCreate, islead);
  }

  function editTeam(e) {
    props.edit();
  }

  function getChallengePanels() {
    return teams.map((c) => (
      {
        title: c.name,
        content: getTeamListItems(c.teams)
      }      
    ));
  }

  function getTeamListItems(teamlist) {
    if (teamlist) {
      return teamlist.map((team) => (
        <TeamListItem
          Callback={joinOrLeaveTeam}
          edit={editTeam}
          key={team.id}
          team={team}
          isTeamMember={team.id === props.myteam}
          hasTeam={props.myteam}
          islead={props.islead}
        />
      ))
    }
    else {
      return (
        <div>No teams.</div>
      )
    }
  }

  return (
    <Accordion
      fluid
      styled
      exclusive={false}
      panels={getChallengePanels()}>
    </Accordion>
  );
}

export default TeamsList;
