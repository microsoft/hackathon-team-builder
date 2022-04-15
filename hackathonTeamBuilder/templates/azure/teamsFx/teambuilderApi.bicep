@secure()
param provisionParameters object
param provisionOutputs object
@secure()
param currentAppSettings object

var webAppName = split(provisionOutputs.graphqlAPIOutput.value.webAppResourceId, '/')[8]
var aadGraphClientId = provisionParameters['m365ClientId']
var aadGraphClientSecret = provisionParameters['m365ClientSecret']
var aadGraphClientTenantId = provisionParameters['m365TenantId']

resource apiWebAppSettings 'Microsoft.Web/sites/config@2021-02-01' = {
  name: '${webAppName}/appsettings'
  properties: union({
    'GraphClient:ClientId': aadGraphClientId
    'GraphClient:ClientSecret': aadGraphClientSecret
    'GraphClient:TenantId': aadGraphClientTenantId
    'AzureAd:ClientId': aadGraphClientId
    'AzureAd:ClientSecret': aadGraphClientSecret
    'AzureAd:TenantId': aadGraphClientTenantId
  }, currentAppSettings)
}
