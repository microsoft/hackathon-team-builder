import React, { useState, useEffect } from "react";
import { Checkbox, Form, Input, Flex, FormMessage, dropdownSelectedItemClassName } from '@fluentui/react-northstar';
import "./App.css";
import * as microsoftTeams from "@microsoft/teams-js";
import { v4 as uuid } from 'uuid';

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
  const [githubIntegration, setGithubIntegration] = useState(false);
  const [formErrors, setFormErrors] = useState(initValidation());
  const [entityId, setEntityId] = useState('');

  function initValidation() {
    return {
      // githubOrg: 'Github organization name cannot be empty.',
      // githubKey: 'Github authorization key cannot be empty.',
      // maxTeamSize: 'Max team size cannot be empty.'
    }
  }

  const teamFields = [    
    {
      label: 'Auto-create Teams Channels',
      name: 'teamsChannel',
      id: 'teamsChannel',
      key: 'teamsChannel',
      inline: true,
      required: false,
      errorMessage: formErrors['teamsChannel'],
      control: {
        as: Checkbox,
        value: teamsChannel,
        onChange: handleCheckboxChange
      }
    },
    {
      label: 'Use MS Teams private channels',
      name: 'useTeamsPrivateChannel',
      id: 'useTeamsPrivateChannel',
      key: 'useTeamsPrivateChannel',
      inline: true,
      required: false,
      errorMessage: formErrors['useTeamsPrivateChannel'],
      control: {
        as: Checkbox,
        value: useTeamsPrivateChannel,
        onChange: handleCheckboxChange
      }
    },
    {
      label: 'Join approval required',
      name: 'joinApprovalRequired',
      id: 'joinApprovalRequired',
      key: 'joinApprovalRequired',
      inline: true,
      required: false,
      errorMessage: formErrors['joinApprovalRequired'],
      control: {
        as: Checkbox,
        value: joinApprovalRequired,
        onChange: handleCheckboxChange
      }
    },
    {
      label: 'Max team size',
      name: 'maxTeamSize',
      id: 'maxTeamSize',
      key: 'maxTeamSize',
      required: false,
      errorMessage: formErrors['maxTeamSize'],
      inline: true,
      control: {
        as: Input,
        value: maxTeamSize,
        showSuccessIndicator: false,
        onChange: handleInputChange
      }
    },
  ];

  const githubFields = [    
    {
      label: 'Enabled',
      name: 'githubIntegration',
      id: 'githubIntegration',
      key: 'githubIntegration',
      inline: true,
      required: false,
      errorMessage: formErrors['githubIntegration'],
      control: {
        as: Checkbox,
        value: githubIntegration,
        onChange: handleCheckboxChange
      }
    },
    {
      label: 'GitHub Organization',
      name: 'githubOrg',
      id: 'githubOrg',
      key: 'githubOrg',
      required: false,
      inline: true,
      errorMessage: formErrors['githubOrg'],
      control: {
        as: Input,
        value: githubOrg,
        showSuccessIndicator: false,
        onChange: handleInputChange
      }
    }
  ]; 

  useEffect(() => {
    // Initialize the Microsoft Teams SDK
    microsoftTeams.initialize();
    microsoftTeams.getContext(ctx => {
      //setTeamId(ctx.teamId);
    });

    microsoftTeams.settings.getSettings(settings => {
      setEntityId(settings.entityId);
    });
    /**
     * When the user clicks "Save", save the url for your configured tab.
     * This allows for the addition of query string parameters based on
     * the settings selected by the user.
     */
    microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {
      const baseUrl = `https://${window.location.hostname}:${window.location.port}`;
      microsoftTeams.settings.setSettings({
        suggestedDisplayName: "TeamBuilder",
        entityId: entityId ?? uuid().slice(0,8),
        contentUrl: baseUrl + "/index.html#/tab",
        websiteUrl: baseUrl + "/index.html#/tab",
      });

      //TODO store settings to DB

      saveEvent.notifySuccess();
    });

  }, [])

  function handleCheckboxChange(_, item) {
    const { name, checked } = item;
    let currentFormErrors = formErrors;
    
    switch (name) {
      case 'teamsChannel':
        setTeamsChannel(checked);
        break;
      case 'useTeamsPrivateChannel':
        setUseTeamsPrivateChannel(checked);
        break;
      case 'joinApprovalRequired':
        setJoinApprovalRequired(checked);
        break;
      case 'githubIntegration':
        setGithubIntegration(checked);
        validateOrgName(githubOrg, checked, currentFormErrors);
        break;
      default:
        break;
    }
    setFormErrors(currentFormErrors);
    isValid();    
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    let currentFormErrors = formErrors;

    switch (name) {      
      case 'maxTeamSize':
          setMaxTeamSize(value);          
          break;
      case 'githubOrg':        
        setGithubOrg(value);
        validateOrgName(value, githubIntegration, currentFormErrors);
        break;      
      default:
        break;
    }    
    setFormErrors(currentFormErrors);
    isValid();
  }

  function validateOrgName(value, isChecked, formErrors) {
    if ((!value || value === '') && isChecked) {
      formErrors['githubOrg'] = 'Org Name cannot be empty!';      
    }
    else {
      delete formErrors['githubOrg'];          
    }
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
      microsoftTeams.settings.setValidityState(false);
      return false;
    }
    else {
      /**
     * After verifying that the settings for your tab are correctly
     * filled in by the user you need to set the state of the dialog
     * to be valid.  This will enable the save button in the configuration
     * dialog.
     */
    microsoftTeams.settings.setValidityState(true);
      return true;
    }
  }

  return (
    <div className="configuration-page">
      <div>
        <Flex column fluid>
          <h3>Teams Settings</h3>
          <Form fields={teamFields} />
          <h3>GitHub Settings</h3>
          <Form fields={githubFields} />          
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
