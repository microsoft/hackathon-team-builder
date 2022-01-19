@secure()
param provisionParameters object
param provisionOutputs object
var simpleAuthCurrentAppSettings = list('${provisionOutputs.simpleAuthOutput.value.webAppResourceId}/config/appsettings', '2021-02-01').properties
var teamApiCurrentAppSettings = list('${provisionOutputs.graphqlAPIOutput.value.webAppResourceId}/config/appsettings', '2021-02-01').properties

module teamsFxSimpleAuthConfig './teamsFx/simpleAuth.bicep' = {
  name: 'addTeamsFxSimpleAuthConfiguration'
  params: {
    provisionParameters: provisionParameters
    provisionOutputs: provisionOutputs
    currentAppSettings: simpleAuthCurrentAppSettings
  }
}

// module teamsFxApiConfig './teamsFx/teambuilderApi.bicep' = {
//   name: 'addTeamsFxApiConfiguration'
//   params: {
//     provisionParameters: provisionParameters
//     provisionOutputs: provisionOutputs
//     currentAppSettings: teamApiCurrentAppSettings
//   }
// }
