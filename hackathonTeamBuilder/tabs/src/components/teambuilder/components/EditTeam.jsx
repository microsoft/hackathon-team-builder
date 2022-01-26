import React, { useState, useEffect } from 'react';
import { Button, Form, Input, TextArea } from '@fluentui/react-northstar';

function TeamForm(props) {
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [challengeName, setChallengeName] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const fields = [
    {
      label: 'Challenge Area',
      name: 'challengeName',
      id: 'challengeName',
      key: 'challengeName',
      control: {
        as: Input,
        value: challengeName,
        disabled: true
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
        disabled: true
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
          content: 'Save',
        },
        key: 'submit',
    }
  ]; 

  useEffect(() => {
    if (props.team) {
      let t = props.team;
      let currentErrors = formErrors;

      setTeamName(t.name);
      setTeamDescription(t.description);
      setChallengeName(t.challenge.name);

      if (t.name && t.name !== '') delete currentErrors['teamName'];
      if (t.description && t.description !== '') delete currentErrors['teamDescription'];

      setFormErrors(currentErrors);
    }
  }, [props.team])

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

  function handleSubmit(event) {
    event.preventDefault();
    if (isValid()) {
        let input = {
            id: props.team.id,
            description: teamDescription
          };
          props.editTeam(input);
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