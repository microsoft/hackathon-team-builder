@secure()
param provisionParameters object
param provisionOutputs object
@secure()
param currentAppSettings object

var webAppName = split(provisionOutputs.graphqlAPIOutput.value.webAppResourceId, '/')[8]
var aadGraphClientSecret = provisionParameters['m365ClientSecret']
var teamBuilderConnectionString = provisionParameters['teamBuilderConnectionString']

resource apiWebAppSettings 'Microsoft.Web/sites/config@2021-02-01' = {
  name: '${webAppName}/appsettings'
  properties: union({
    'GraphClient:ClientSecret': aadGraphClientSecret
  }, currentAppSettings)
}

// resource apiWebAppConnectionStrings 'Microsoft.Web/sites/config@2021-02-01' = {
//   name: '${webAppName}/connectionstrings'
//   properties: {
//     connectionStrings: [
//       {
//         name: 'teambuilder'
//         type: 'SQLAzure'
//         value: teamBuilderConnectionString
//       }
//     ]
//   }
// }
