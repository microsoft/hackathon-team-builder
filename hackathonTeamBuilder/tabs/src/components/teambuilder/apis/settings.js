import graphapi from './graphapi';
import { loader } from 'graphql.macro';

function AppSettings(authToken) {
  const SETTINGSQUERY = loader('../graphql/settingsquery.graphql');
  const ADDSETTING = loader('../graphql/addsetting.graphql');
  const ADDSETTINGS = loader('../graphql/addsettings.graphql');

  // authToken: jwt bearer token to call graphql api
  // email: email of the logged in user
  async function getAppSettingsForTeam(entityId) {
    let client = graphapi(authToken);
    let response = await client.query({ query: SETTINGSQUERY, variables: { entityId } });
    if (response.data) {
      return response.data;
    }
  } 
  
  async function setAppSetting(input) {
      let client = graphapi(authToken);
      let response = await client.mutate({ mutation: ADDSETTING, variables: { input }});
      if (response.data) {
          return response.data;
      }
  }

  async function addAppSettings(input) {
    let client = graphapi(authToken);
    let response = await client.mutate({ mutation: ADDSETTINGS, variables: { input }});
    if (response.data) {
      return response.data;
    }
  }

  return {
    getAppSettingsForTeam: getAppSettingsForTeam,
    setAppSetting: setAppSetting,
    addAppSettings: addAppSettings
  }
}

export default AppSettings;