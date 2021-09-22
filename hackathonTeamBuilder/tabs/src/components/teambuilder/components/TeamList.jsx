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
      setTeams(newt);
    }
  }, [props.teams]);

  useEffect(() => {
    if (props.challengeOptions) {
      setChallenges(props.challengeOptions);
    }
  }, [props.challengeOptions]);

  function joinOrLeaveTeam(type, id, name, isCreate, islead) {
    props.Callback(type, id, name, isCreate, islead);
  }

  function editTeam(e) {
    props.edit();
  }

  function getChallengesList() {
    return challenges.map((c) => (
      {
        title: c.name,
        content: getTeamListItems(teams[c.track])
      }      
    ));
  }

  function getTeamListItems(teamlist) {
    if (teamlist) {
      const t = _.orderBy(teamlist, 'teamName')
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
      panels={getChallengesList()}>
    </Accordion>
  );
}

export default TeamsList;
