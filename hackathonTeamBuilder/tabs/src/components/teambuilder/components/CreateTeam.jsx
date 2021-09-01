import React, { useState, useEffect } from 'react';
import { Dropdown, Label, Button } from '@fluentui/react-northstar';

function TeamForm(props) {

  function initValidation() {
    return {
      challengeName: 'Select a challenge area.',
      //msTeamsChannel: 'Select a team channel.',
      teamName: 'Team Name cannot be empty.',
      teamDescription: 'Team Description cannot be empty.',
    }
  }

  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [challengeName, setChallengeName] = useState('');
  const [challengeNameOptions, setChallengeNameOptions] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState('');
  const [msTeamsChannel, setChannel] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);

  const [formErrors, setFormErrors] = useState(initValidation());

  useEffect(() => {
    if (props.challengeOptions){
      let items = props.challengeOptions.map((c) => {
        return { header: c.name, content: c.description, value: c.id }
      });
      setChallengeNameOptions(items);
    }

    if (props.team) {
      let t = props.team;
      let currentErrors = formErrors;

      setTeamName(t.teamName);
      setTeamDescription(t.teamDescription);
      setChallengeName(t.challengeName);
      setChannel(t.msTeamsChannel);

      if (t.teamName && t.teamName !== '') delete currentErrors['teamName'];
      if (t.teamDescription && t.teamDescription !== '') delete currentErrors['teamDescription'];
      if (t.challengeName && t.challengeName !== '') delete currentErrors['challengeName'];
      if (t.msTeamsChannel && t.msTeamsChannel !== '') delete currentErrors['msTeamsChannel'];

      setFormErrors(currentErrors);
    }
  }, [props.team, props.challengeOptions]);

  function handleInputChange(e) {
    const { name, value } = e.target;
    let currentFormErrors = formErrors;

    switch (name) {
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

  function handleDropDownChange(event, option) {
    const { name, value } = option;
    let currentFormErrors = formErrors;

    switch (name) {
      case 'challengeName':
        delete currentFormErrors[name];
        setChallengeName(value.content);
        break;
      case 'msTeamsChannel':
        setChannel(value);
        if (!value || value === '') {
          currentFormErrors[name] = 'Team Channel cannot be empty';
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

  function newTeam() {
    let body = {
      teamName: teamName,
      teamDescription: teamDescription,
      challengeName: challengeName,
      skillsWanted: skillsWanted
    }
    props.createTeam(body);
  }

  function editTeam() {
    let body = {
      teamName: props.team.teamName,
      teamDescription: teamDescription,
      challengeName: challengeName,
      skillsWanted: skillsWanted
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
    <div className="ui segment">
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
              <Dropdown name="challengeName" placeholder='Select a challenge' fluid checkable items={challengeNameOptions} onChange={handleDropDownChange} defaultValue={challengeName} />
            </div>
          }          

          {props.team ? "" :
            <div className="field">
              <label>Team Name</label>
              <input required id="teamName" value={teamName} name="teamName" type="text" onChange={handleInputChange} className={
                formErrors && (formErrors.teamName || formErrors.duplicateName || formErrors.invalidName)
                  ? 'form-control error'
                  : 'form-control'
              } />
            </div>
          }

          <div className="field">
            <label>Team description</label>
            <textarea required value={teamDescription} name="teamDescription" rows="2" onChange={handleInputChange}></textarea>
          </div>
          
          {props.team ? "" :
            <div className="field">

            </div>
          }
          <div className="ui basic segment">
            {submitting ?
              <span className="ui">Creating...</span>
              :
              <div>
                {!isValid() && <ul>
                  {Object.entries(formErrors || {}).map(([prop, value]) => {
                    return (
                      <li className='error-message' key={prop}>
                        {value}
                      </li>
                    );
                  })}
                </ul>
                }
                <div>
                  <Button primary type="submit" disabled={!isValid()}>{props.team ? 'Save' : 'Create Team'}</Button>
                  <Button onClick={cancelClick}>Cancel</Button>
                </div>

              </div>
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