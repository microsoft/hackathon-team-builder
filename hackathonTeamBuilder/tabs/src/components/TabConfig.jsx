import React, { useState, useEffect } from "react";
import { Checkbox, Form, Input, Flex } from "@fluentui/react-northstar";
import "./App.css";
import * as microsoftTeams from "@microsoft/teams-js";
import AppSettings from "./teambuilder/apis/settings";
import { useSettings } from "./teambuilder/hooks/settings";
import { v4 as uuid } from 'uuid';

/**
 * The 'Config' component is used to display your group tabs
 * user configuration options.  Here you will allow the user to
 * make their choices and once they are done you will need to validate
 * their choices and communicate that to Teams to enable the save button.
 */
function TabConfig() {
  const settingsClient = AppSettings();
  const savedSettings = useSettings();

  const [teamId, setTeamId] = useState('');
  const [entityId, setEntityId] = useState('');
  const [teamsChannel, setTeamsChannel] = useState(false);
  const [useTeamsPrivateChannel, setUseTeamsPrivateChannel] = useState(false);
  const [joinApprovalRequired, setJoinApprovalRequired] = useState(false);
  const [maxTeamSize, setMaxTeamSize] = useState('0');
  const [githubOrg, setGithubOrg] = useState('');
  const [githubIntegration, setGithubIntegration] = useState(false);
  const [formErrors, setFormErrors] = useState({});

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
        checked: teamsChannel,
        onChange: handleCheckboxChange,
      },
    },
    // {
    //   label: 'Use MS Teams private channels',
    //   name: 'useTeamsPrivateChannel',
    //   id: 'useTeamsPrivateChannel',
    //   key: 'useTeamsPrivateChannel',
    //   inline: true,
    //   required: false,
    //   errorMessage: formErrors['useTeamsPrivateChannel'],
    //   control: {
    //     as: Checkbox,
    //     value: useTeamsPrivateChannel,
    //     checked: useTeamsPrivateChannel,
    //     onChange: handleCheckboxChange,
    //   },
    // },
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
        checked: joinApprovalRequired,
        onChange: handleCheckboxChange,
      },
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
        checked: githubIntegration,
        onChange: handleCheckboxChange,
      },
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
        onChange: handleInputChange,
      },
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      microsoftTeams.getContext((ctx) => {
        setTeamId(ctx.teamId);

        microsoftTeams.settings.getSettings((settings) => {
          setEntityId(settings.entityId ?? uuid().slice(0, 8));
        });
      });
    };

    // Initialize the Microsoft Teams SDK
    microsoftTeams.initialize();    

    loadData();
  }, []);

  useEffect(() => {
    if (savedSettings) {
      setTeamsChannel(savedSettings.useTeams);
      setUseTeamsPrivateChannel(savedSettings.usePrivateChannels);
      setJoinApprovalRequired(savedSettings.authEnabled);
      setMaxTeamSize(''+savedSettings.maxTeamSize);
      setGithubOrg(savedSettings.gitHubOrg);
      setGithubIntegration(savedSettings.gitHubEnabled);
    }
  }, [savedSettings]);

  useEffect(() => {
    microsoftTeams.settings.registerOnSaveHandler(saveHandler);
  }, [entityId, teamId, teamsChannel, useTeamsPrivateChannel, joinApprovalRequired, maxTeamSize, githubOrg, githubIntegration])

  const saveHandler = async (saveEvent) => {    
      const baseUrl = `https://${window.location.hostname}:${window.location.port}`;
      microsoftTeams.settings.setSettings({
        suggestedDisplayName: "TeamBuilder",
        entityId: entityId ?? uuid().slice(0,8),
        contentUrl: baseUrl + "/index.html#/tab",
        websiteUrl: baseUrl + "/index.html#/tab",
      });

      //TODO store settings to DB
      const input = [
        {
          msTeamId: entityId,
          setting: "TEAM_ID",
          value: teamId,
        },
        {
          msTeamId: entityId,
          setting: "USE_TEAMS",
          value: teamsChannel.toString(),
        },
        {
          msTeamId: entityId,
          setting: "USE_PRIVATE_CHANNELS",
          value: useTeamsPrivateChannel.toString(),
        },
        {
          msTeamId: entityId,
          setting: "ENABLE_AUTH",
          value: joinApprovalRequired.toString(),
        },
        {
          msTeamId: entityId,
          setting: "MAX_TEAM_SIZE",
          value: maxTeamSize,
        },
        {
          msTeamId: entityId,
          setting: "GIT_HUB_ENABLED",
          value: githubIntegration.toString(),
        },
        {
          msTeamId: entityId,
          setting: "GIT_HUB_ORG",
          value: githubOrg,
        },
      ];
      
      if (await settingsClient.addAppSettings.request(input)) saveEvent.notifySuccess();
      else saveEvent.notifyFailure();
  };  

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

  function validateOrgName(value, isChecked, errors) {
    if ((!value || value === "") && isChecked) {
      errors["githubOrg"] = "Org Name cannot be empty!";
    } else {
      delete errors["githubOrg"];
    }
  }

  function isValid() {
    if (Object.entries(formErrors || {}).length > 0) {
      microsoftTeams.settings.setValidityState(false);
    } else {
      microsoftTeams.settings.setValidityState(true);
    }
  }

  return (
    <div className="configuration-page">
      <div>
        Settings ID: {entityId}
        <Flex column fluid>
          <h3>Teams Settings</h3>
          <Form fields={teamFields} />
          <h3>GitHub Settings</h3>
          <Form fields={githubFields} />          
        </Flex>        
      </div>
    </div>
  );

}

export default TabConfig;
