@secure()
param provisionParameters object
param provisionOutputs object
@secure()
param currentAppSettings object

var webAppName = split(provisionOutputs.graphqlAPIOutput.value.webAppResourceId, '/')[8]
var aadGraphClientId = provisionParameters['m365ClientId']
var aadGraphClientSecret = provisionParameters['m365ClientSecret']
var aadGraphClientTenantId = provisionParameters['m365TenantId']
var dbName = split(provisionOutputs.graphqlAPIOutput.value.sqlDatabaseResourceId, '/')[10]
var teamBuilderConnectionString = 'Server=tcp:${provisionOutputs.graphqlAPIOutput.value.sqlHostName},1433;Initial Catalog=${dbName};Persist Security Info=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'

resource apiWebAppSettings 'Microsoft.Web/sites/config@2021-02-01' = {
  name: '${webAppName}/appsettings'
  properties: union({
    'GraphClient:ClientId': aadGraphClientId
    'GraphClient:ClientSecret': aadGraphClientSecret
    'GraphClient:TenantId': aadGraphClientTenantId
  }, currentAppSettings)
}

resource apiWebAppConnectionStrings 'Microsoft.Web/sites/config@2021-02-01' = {
  name: '${webAppName}/connectionstrings'
  properties: {
      teambuilder: {
        type: 'SQLAzure'
        value: teamBuilderConnectionString
      }
  }
}
