import React, { useState, useEffect } from 'react';
import { Accordion } from '@fluentui/react-northstar';
import TeamListItem from './TeamListItem';
var _ = require('agile');

function TeamsList(props) {

  const [teams, setTeams] = useState([]);
  const [challenges, setChallenges] = useState([]);

  function groupBy(array, property) {
    var hash = {};
    for (var i = 0; i < array.length; i++) {
      if (!hash[array[i][property]]) hash[array[i][property]] = [];
      hash[array[i][property]].push(array[i]);
    }
    return hash;
  }

  useEffect(() => {
    if (props.teams) {
      let newt = groupBy(props.teams, 'challengeName');
      let newc = Object.getOwnPropertyNames(newt);
      setTeams(newt);
      setChallenges(newc);
    }
  }, [props.teams]);

  function joinOrLeaveTeam(type, id, name, isCreate, islead) {
    props.Callback(type, id, name, isCreate, islead);
  }

  function editTeam(e) {
    props.edit();
  }

  function getChallengesList() {
    challenges.sort();

    return challenges.map((c) => (
      {
        title: c,
        content: getTeamListItems(teams[c])
      }      
    ));
  }

  function getTeamListItems(teamlist) {
    const t = _.orderBy(teamlist, 'msTeamsChannelName')
    return t.map((team) => (
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

  return (
    <Accordion
      fluid
      styled
      exclusive={false}
      panels={getChallengesList()}>
    </Accordion>
  );
}

export default TeamsList;
