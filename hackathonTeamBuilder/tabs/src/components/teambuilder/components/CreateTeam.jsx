import React, { useState, useEffect } from 'react';
import { Dropdown, Label, Button } from '@fluentui/react-northstar';

function TeamForm(props) {

  function initChannelOptions() {
    const channelItems = [];
    for (let i = 1; i < 21; i++) { channelItems.push({ key: 'Team 1.' + ('0' + i).slice(-2), text: 'Team 1.' + ('0' + i).slice(-2), value: 'Team 1.' + ('0' + i).slice(-2) }); }
    for (let i = 1; i < 21; i++) { channelItems.push({ key: 'Team 2.' + ('0' + i).slice(-2), text: 'Team 2.' + ('0' + i).slice(-2), value: 'Team 2.' + ('0' + i).slice(-2) }); }
    for (let i = 1; i < 21; i++) { channelItems.push({ key: 'Team 3.' + ('0' + i).slice(-2), text: 'Team 3.' + ('0' + i).slice(-2), value: 'Team 3.' + ('0' + i).slice(-2) }); }
    for (let i = 1; i < 21; i++) { channelItems.push({ key: 'Team 4.' + ('0' + i).slice(-2), text: 'Team 4.' + ('0' + i).slice(-2), value: 'Team 4.' + ('0' + i).slice(-2) }); }
    for (let i = 1; i < 21; i++) { channelItems.push({ key: 'Team 5.' + ('0' + i).slice(-2), text: 'Team 5.' + ('0' + i).slice(-2), value: 'Team 5.' + ('0' + i).slice(-2) }); }
    return channelItems;
  }

  function initChallengeNameOptions() {
    return [
      { key: 'Education', text: 'Track 1 - Vaccine Education & Delivery', value: 'Track 1 - Vaccine Education & Delivery' },
      { key: 'MedicalDeserts', text: 'Track 2 - Medical Deserts', value: 'Track 2 - Medical Deserts' },
      { key: 'Equity', text: 'Track 3 - Health Equity & Racial Disparities', value: 'Track 3 - Health Equity & Racial Disparities' },
      { key: 'Care', text: 'Track 4 - New Models and Settings for Care', value: 'Track 4 - New Models and Settings for Care' },
      { key: 'Open', text: 'Track 5 - Open Topic', value: 'Track 5 - Open Topic' }
    ]
  }

  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [challengeName, setChallengeName] = useState('');
  const [channelOptions, setChannelOptions] = useState(initChannelOptions());
  const [challengeNameOptions, setChallengeNameOptions] = useState(initChallengeNameOptions());
  const [skillsWanted, setSkillsWanted] = useState([]);
  const [msTeamsChannel, setChannel] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (props.team) {
      let t = props.team;

      setTeamName(t.teamName);
      setTeamDescription(t.teamDescription);
      setChallengeName(t.challengeName);
      setChannel(t.msTeamsChannel);
    }
  }, [props.team]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    let currentFormErrors = formErrors;

    switch (name) {
      case 'msTeamsChannel':
        setChannel(value);
        if (!value || value === '') {
          currentFormErrors[name] = 'Team Channel cannot be empty';
        }
        else {
          delete currentFormErrors[name];
        }
        break;
      case 'teamName':
        setTeamName(value);
        if (!value || value === '') {
          currentFormErrors[name] = 'Team Name cannot be empty';
        }
        else {
          delete currentFormErrors[name];
          validateTeamName(value, currentFormErrors);
        }
        break;
      case 'teamDescription':
        setTeamDescription(value);
        if (!value || value === '') {
          currentFormErrors[name] = 'Team Description cannot be empty';
        }
        else {
          delete currentFormErrors[name];
        }
        break;
      default:
        break;
    }

    setFormErrors(currentFormErrors);
  }

  function handleInputChangeTrack(event) {
    const { name, value } = event.target;
    switch (name) {
      case 'challengeName':
        setChallengeName(value);
    }

    updateDropDown(value.match(/(\d+)/)[0])
  }

  function updateDropDown(n) {
    let options = [];
    for (let i = 1; i < 21; i++) { options.push({ key: 'Team ' + n + '.' + ('0' + i).slice(-2), text: 'Team ' + n + '.' + ('0' + i).slice(-2), value: 'Team ' + n + '.' + ('0' + i).slice(-2) }); }
    setChannelOptions(options);
  }

  function newTeam() {
    let body = {
      teamName: teamName,
      teamDescription: teamDescription,
      challengeName: challengeName,
      skillsWanted: skillsWanted,
      msTeamsChannel: msTeamsChannel
    }
    props.createTeam(body);
  }

  function editTeam() {
    let body = {
      teamName: props.team.teamName,
      teamDescription: teamDescription,
      challengeName: challengeName,
      skillsWanted: skillsWanted,
      msTeamsChannel: msTeamsChannel
    };
    props.editTeam(body);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isValid()) {
      setSubmitting(true);
      if (!props.team) {
        // Activity Id for creating team is 12
        props.activityPoints(12)
        newTeam();
      } else {
        editTeam();
      }
      return true;
    }
  }

  function validateTeamName(value, currentErrors) {
    let compareVal = value.toLowerCase();
    delete currentErrors['duplicateName'];
    for (let existingTeam of props.teamNames) {
      if (existingTeam.toLowerCase() == compareVal) {
        currentErrors['duplicateName'] = 'Team name already exists!'
        break;
      }
    }

    // Don't allow special characters
    var isValid = value.match(/^[a-zA-Z0-9\s]+$/g);
    if (!isValid) {
      currentErrors['invalidName'] = 'Invalid Team Name. Only alpha-numeric characters are allowed.';
    }
    else {
      delete currentErrors['invalidName'];
    }
  }

  function isValid() {
    if (Object.entries(formErrors || {}).length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  function cancelClick(e) {
    e.preventDefault();
    props.cancel();
  }

  return (
    <div hidden={!props.visible} className="ui segment">
      {!created ?
        <form onSubmit={handleSubmit} className="ui form">
          {!props.team ? "" :
            <div className="field">
              <h2>{teamName}</h2>
            </div>
          }
          {props.team ? "" :
            <div className="field">
              <label>Challenge Area</label>
              <Dropdown name="challengeName" placeholder='Select a challenge' fluid selection options={challengeNameOptions} onChange={handleInputChangeTrack} defaultValue={challengeName} />
            </div>
          }

          <div className="field">
            <label>Assigned Team Channel</label>
            <Dropdown name="msTeamsChannel" fluid selection options={channelOptions} onChange={handleInputChange} placeholder={msTeamsChannel} />

          </div>

          {props.team ? "" :
            <div className="field">
              <label>Team Name</label>
              <input id="teamName" value={teamName} name="teamName" type="text" onChange={handleInputChange} className={
                formErrors && (formErrors.teamName || formErrors.duplicateName || formErrors.invalidName)
                  ? 'form-control error'
                  : 'form-control'
              } />
            </div>
          }

          <div className="field">
            <label>Team description</label>
            <textarea value={teamDescription} name="teamDescription" rows="2" onChange={handleInputChange}></textarea>
          </div>
          {/* <div className="field">
              <label>We are looking for people with these skills (comma seperated (ex: C#, HIPAA, EPIC)</label>
              <input value={skillsWanted} name="skillsWanted" type="text" onChange={handleInputChange} />
            </div> */}
          {props.team ? "" :
            <div className="field">

            </div>
          }
          <div className="ui basic segment">
            {submitting ?
              <span className="ui">Creating...</span>
              :
              (isValid() ?
                <div>
                  <Button primary type="submit">{props.team ? 'Save' : 'Create Team'}</Button>
                  <Button onClick={cancelClick}>Cancel</Button>
                </div>
                :
                <ul>
                  {Object.entries(formErrors || {}).map(([prop, value]) => {
                    return (
                      <li className='error-message' key={prop}>
                        {value}
                      </li>
                    );
                  })}
                </ul>
              )
            }
          </div>
        </form>
        :
        <span className="ui">Team Created</span>
      }
    </div>
  )
}

export default TeamForm;