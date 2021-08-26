import React, { useState, useEffect } from 'react';
import { Accordion, Icon, Card } from 'semantic-ui-react'
import TeamListItem from './teamlistitem';
var _ = require('agile');

function TeamsList(props) {

  const [activeIndex, setActiveIndex] = useState(-1);
  const [teams, setTeams] = useState([]);
  const [challenges, setChallenges] = useState([]);

  function handleClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  }

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

    return challenges.map((c, index) => (
      <div key={index} >
        <Accordion.Title
          active={activeIndex === index}
          index={index}
          onClick={handleClick}
        >
          <h3><Icon name='dropdown' />{c}</h3>
        </Accordion.Title>
        <Accordion.Content
          active={activeIndex === index}
        >
          <Card.Group>
            {getTeamListItems(teams[c])}
          </Card.Group>
        </Accordion.Content>
      </div>
    ));
  }

  function getTeamListItems(teamlist) {
    const t = _.orderBy(teamlist, 'msTeamsChannel')
    return t.map((team) => (
      <TeamListItem
        Callback={joinOrLeaveTeam}
        edit={editTeam}
        key={team.id}
        membership={props.membership}
        team={team}
        isTeamMember={team.id === props.myteam}
        hasTeam={props.myteam > 0}
        islead={props.islead}
      />
    ))
  }

  return (
    <Accordion
      fluid
      styled
      exclusive={false}>
      {getChallengesList()}
    </Accordion>
  );
}

export default TeamsList;
