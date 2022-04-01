import React, { useState, useEffect } from "react";
import { Checkbox, Form, Input, Flex } from '@fluentui/react-northstar';
import "./App.css";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * The 'Config' component is used to display your group tabs
 * user configuration options.  Here you will allow the user to
 * make their choices and once they are done you will need to validate
 * their choices and communicate that to Teams to enable the save button.
 */
 function TabConfig(props) {

  const [teamsChannel, setTeamsChannel] = useState(false);
  const [useTeamsPrivateChannel, setUseTeamsPrivateChannel] = useState(false);
  const [joinApprovalRequired, setJoinApprovalRequired] = useState(false);
  const [maxTeamSize, setMaxTeamSize] = useState('');
  const [githubOrg, setGithubOrg] = useState('');
  const [githubKey, setGithubKey] = useState('');
  const [formErrors, setFormErrors] = useState(initValidation());

  function initValidation() {
    return {
      githubOrg: 'Github organization name cannot be empty.',
      githubKey: 'Github authorization key cannot be empty.',
      teamsChannel: '',
      maxTeamSize: 'Max team size cannot be empty.',
      joinApprovalRequired: '',
      useTeamsPrivateChannel: '',      
    }
  }

  const fields = [
    {
      label: 'Use MS Teams',
      name: 'teamsChannel',
      id: 'teamsChannel',
      key: 'teamsChannel',
      required: false,
      errorMessage: formErrors['teamsChannel'],
      control: {
        as: Checkbox,
        value: teamsChannel,
        showSuccessIndicator: false,
        onChange: handleInputChange
      },
    },
    {
      label: 'Use MS Teams private channels',
      name: 'useTeamsPrivateChannel',
      id: 'useTeamsPrivateChannel',
      key: 'useTeamsPrivateChannel',
      required: true,
      errorMessage: formErrors['useTeamsPrivateChannel'],
      control: {
        as: Checkbox,
        value: useTeamsPrivateChannel,
        showSuccessIndicator: false,
        onChange: handleInputChange
      },
    },
    {
      label: 'Join approval required',
      name: 'joinApprovalRequired',
      id: 'joinApprovalRequired',
      key: 'joinApprovalRequired',
      required: false,
      errorMessage: formErrors['joinApprovalRequired'],
      control: {
        as: Checkbox,
        value: joinApprovalRequired,
        showSuccessIndicator: false,
        onChange: handleInputChange
      },
    },
    {
      label: 'Max team size',
      name: 'maxTeamSize',
      id: 'maxTeamSize',
      key: 'maxTeamSize',
      required: false,
      errorMessage: formErrors['maxTeamSize'],
      control: {
        as: Input,
        value: maxTeamSize,
        showSuccessIndicator: false,
        onChange: handleInputChange
      },
    },
    {
      label: 'GitHub Organization',
      name: 'githubOrg',
      id: 'githubOrg',
      key: 'githubOrg',
      required: false,
      errorMessage: formErrors['githubOrg'],
      control: {
        as: Input,
        value: githubOrg,
        showSuccessIndicator: false,
        onChange: handleInputChange
      },
    },
    {
      label: 'GitHub Key',
      name: 'githubKey',
      id: 'githubKey',
      key: 'githubkey',
      required: false,
      errorMessage: formErrors['githubKey'],
      control: {
        as: Input,
        value: githubKey,
        showSuccessIndicator: false,
        onChange: handleInputChange
      },
    },
  ]; 

  useEffect(() => {

    console.log("UseEffect called..");
    // Initialize the Microsoft Teams SDK
    microsoftTeams.initialize();

    /**
     * When the user clicks "Save", save the url for your configured tab.
     * This allows for the addition of query string parameters based on
     * the settings selected by the user.
     */
    microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {
      const baseUrl = `https://${window.location.hostname}:${window.location.port}`;
      microsoftTeams.settings.setSettings({
        suggestedDisplayName: "Settings",
        entityId: "Test",
        contentUrl: baseUrl + "/index.html#/tab",
        websiteUrl: baseUrl + "/index.html#/tab",
      });
      saveEvent.notifySuccess();
    });

    /**
     * After verifying that the settings for your tab are correctly
     * filled in by the user you need to set the state of the dialog
     * to be valid.  This will enable the save button in the configuration
     * dialog.
     */
    microsoftTeams.settings.setValidityState(true);

  }, [])

  function handleInputChange(e) {

    console.log("handleInputChange called..");
    //
    const { name, value } = e.target;
    console.log(`name: ${name} value: ${value}`);
    let currentFormErrors = formErrors;
    //
    switch (name) {
      case 'teamsChannel':
        setTeamsChannel(e.target.checked);
        if (!e.target.checked === true) {
          currentFormErrors[name] = formErrors[teamsChannel];
        }
        else {
          delete currentFormErrors[name];
        }
        break;
      case 'useTeamsPrivateChannel':
        setUseTeamsPrivateChannel(e.target.checked);
        if (!e.target.checked) {
          currentFormErrors[name] = formErrors[useTeamsPrivateChannel];
        }
        else {
          delete currentFormErrors[name];
        }
        break;
      case 'joinApprovalRequired':
          setJoinApprovalRequired(e.target.checked);
          if (!e.target.checked) {
            currentFormErrors[name] = formErrors[joinApprovalRequired];
          }
          else {
            delete currentFormErrors[name];
          }
          break;
      case 'maxTeamSize':
          setMaxTeamSize(value);
          if (!value || value === '') {
            currentFormErrors[name] = formErrors[maxTeamSize];
          }
          else {
            delete currentFormErrors[name];
          }
          break;
      case 'githubOrg':
        setGithubOrg(value);
        if (!value || value === '') {
          currentFormErrors[name] = formErrors[githubOrg];
        }
        else {
          delete currentFormErrors[name];
        }
        break;
      case 'githubKey':
        setGithubKey(value);
        if (!value || value === '') {
          currentFormErrors[name] = formErrors[githubKey];
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
      // TODO: Save settings
      return true;
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
    <div>
      <h3>Tab Configuration</h3>
      <div>
        <Flex padding="padding.small">
          <Form onSubmit={handleSubmit} fields={fields} />
        </Flex>
        {/*
        We will add a form to hold and save the following configuration options:
        TeamsChannels (Enable Teams Integration?) -> Toggle Yes/No
        TeamsPrivateChannels (Using Teams private channels?) -> Toggle Yes/No
        MaxTeamSize (What's your max team size?) -> Textbox, 12
        JoinApproval (Require approval to join a team?) -> Toggle Yes/No
        GitHubOrg (What's your Github org name?) -> Textbox default:NULL
        GitHubAuthKey (What's your Github auth key?) -> Textbox default:NULL
        */}
      </div>
    </div>
  );

}

export default TabConfig;
