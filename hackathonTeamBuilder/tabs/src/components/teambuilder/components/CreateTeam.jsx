import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Form, Input, TextArea } from '@fluentui/react-northstar';

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
  const [challengeNameOptions, setChallengeNameOptions] = useState([]);
  const [formErrors, setFormErrors] = useState(initValidation());

  const fields = [
    {
      label: 'Challenge Area',
      name: 'challengeName',
      id: 'challengeName',
      key: 'challengeName',
      required: true,
      errorMessage: formErrors['challengeName'],
      control: {
        as: Dropdown,
        placeholder: 'Choose a Challenge Area',
        items: challengeNameOptions,
        onChange: handleDropDownChange
      }
    },
    {
      label: 'Team Name',
      name: 'teamName',
      id: 'teamName',
      key: 'teamName',
      required: true,
      errorMessage: formErrors['teamName'],
      control: {
        as: Input,
        value: teamName,
        showSuccessIndicator: false,
        onChange: handleInputChange
      },
    },
    {
      label: "Team Description",
      name: "teamDescription",
      id: "teamDescription",
      key: "teamDescription",
      required: true,
      errorMessage: formErrors['teamDescription'],
      control: {
        as: TextArea,
        rows: 2,
        value: teamDescription,
        onChange: handleInputChange
      }
    },
    {
        control: {
          as: Button,
          content: 'Create Team',
        },
        key: 'submit',
    }
  ]; 

  useEffect(() => {
    if (props.challengeOptions){
      let items = props.challengeOptions.map((c) => {
        return { header: c.name, content: c.description, value: c.id, prefix: c.track }
      });
      setChallengeNameOptions(items);
    }

  }, [props.challengeOptions])

  function handleInputChange(e) {
    const { name, value } = e.target;
    let currentFormErrors = formErrors;

    switch (name) {
      case 'teamName':
        setTeamName(value);
        if (!value || value === '') {
          currentFormErrors[name] = 'Team Name cannot be empty!';
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

  function handleSubmit(event) {
    event.preventDefault();
    if (isValid()) {
      newTeam();
      return true;
    }
  }

  function validateTeamName(value, currentErrors) {
    let compareVal = value.toLowerCase();
    for (let existingTeam of props.teamNames) {
      if (existingTeam.toLowerCase() === compareVal) {
        currentErrors['teamName'] = 'Team name already exists!';
        return;
      }
    }

    // Don't allow special characters
    var isValid = value.match(/^[a-zA-Z0-9\s]+$/g);
    if (!isValid) {
      currentErrors['teamName'] = 'Invalid Team Name. Only alpha-numeric characters are allowed.';
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

  return (
    <Form onSubmit={handleSubmit} fields={fields} />
  )
}

export default TeamForm;