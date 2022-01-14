import React, { useState, useEffect } from 'react';
import { Dropdown, Button } from '@fluentui/react-northstar';

function TeamForm(props) {

  function initValidation() {
    return {
      challengeName: 'Select a challenge area.',
      teamName: 'Team Name cannot be empty.',
      teamDescription: 'Team Description cannot be empty.',
    }
  }

  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [challengeAreaId, setChallengeAreaId] = useState(0);
  const [challengeName, setChallengeName] = useState('');
  const [challengeNameOptions, setChallengeNameOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState(initValidation());

  useEffect(() => {
    if (props.challengeOptions){
      let items = props.challengeOptions.map((c) => {
        return { header: c.name, content: c.description, value: c.id, prefix: c.track }
      });
      setChallengeNameOptions(items);
    }

    if (props.team) {
      let t = props.team;
      let currentErrors = formErrors;

      setTeamName(t.teamName);
      setTeamDescription(t.teamDescription);
      setChallengeName(t.challengeName);

      if (t.teamName && t.teamName !== '') delete currentErrors['teamName'];
      if (t.teamDescription && t.teamDescription !== '') delete currentErrors['teamDescription'];

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
        setChallengeName(value.header);
        setChallengeAreaId(value.value);
        break;      
      default:
        break;
    }

    setFormErrors(currentFormErrors);
  }

  function newTeam() {
    let input = {
      name: teamName,
      description: teamDescription,
      challengeAreaId: challengeAreaId
    }
    props.createTeam(input);
  }

  function editTeam() {
    let input = {
      name: props.team.name,
      description: teamDescription,
      challengeAreaId: challengeAreaId
    };
    props.editTeam(input);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (isValid()) {
      setSubmitting(true);
      if (!props.team) {
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
      if (existingTeam.toLowerCase() === compareVal) {
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
                  <Button primary type="submit" disabled={!isValid()} aria-label="Submit or Save Button">{props.team ? 'Save' : 'Create Team'}</Button>
                  <Button onClick={cancelClick} aria-label="Cancel Button">Cancel</Button>
                </div>

              </div>
            }
          </div>
        </form>
    </div>
  )
}

export default TeamForm;