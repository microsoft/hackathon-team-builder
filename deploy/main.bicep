param prefix string = 'htb-${uniqueString(resourceGroup().id)}'
param tagVersion string = 'htb-version:v1.0.0'
param location string = resourceGroup().location

@secure()
param githubOrg string
@secure()
param githubProductHeaderValue string
@secure()
param githubInstallationId string
@secure()
param githubAppId string
@secure()
param githubPrivateKeyVal string
@secure()
param gitHubTeamId string

@allowed([
  'nonprod'
  'prod'
])
param environmentType string

var cleanPrefix = replace(prefix, '-', '')
var htbAPIAppPlanName = '${prefix}-appPlan'
var htbAPIAppName = '${prefix}-api'
var identityName = '${prefix}-api-identity'
var htbFunctionAppName = '${prefix}-serverless'
var htbFuctionsAppPlanName = '${prefix}-serverlessPlan'
var htbFunctionAppStorageName = length(cleanPrefix) + 6 > 24 ? substring('${cleanPrefix}funcsa',0,24) : '${cleanPrefix}funcsa'
var keyVaultName = length(cleanPrefix) + 2 > 24 ? substring('${cleanPrefix}kv',0,24) : '${cleanPrefix}kv'


// goals:
// create keyvault
// update other two modules to assign keyvault permissions
module keyvaultProvision './modules/keyvault.bicep' = {
  name: 'keyvaultProvision'
  params: {
    tagVersion: tagVersion
    location: location
    keyVaultName: keyVaultName
    githubPrivateKeyVal: githubPrivateKeyVal
  }
}

module gitHubApi './modules/appservice.bicep' = {
  name: 'teambuilder.github'
  params: {
    location: location
    tagVersion: tagVersion
    identityName: identityName
    keyVaultName: keyvaultProvision.outputs.kvName
    environmentType: environmentType
    appName: htbAPIAppName
    appPlanName: htbAPIAppPlanName
    appSettings: [
      {
        name: 'KeyVaultUri'
        value: keyvaultProvision.outputs.vaultUri
      }
      {
        name: 'GitHub__KeyVaultSecret'
        value: keyvaultProvision.outputs.githubPrivateKeyName
      }
      {
        name: 'GitHub__Org'
        value: githubOrg
      }
      {
        name: 'GitHub__GitHubAppId'
        value: githubAppId
      }
      {
        name: 'GitHub__ProductHeaderValue'
        value: githubProductHeaderValue
      }
      {
        name: 'GitHub__InstallationId'
        value: githubInstallationId
      }
    ]
  }
}

// resource teamBuilderApi 'Microsoft.Web/sites/extensions@2021-02-01' existing = {
//   name: ''
// }

module serverless './modules/function-app.bicep' = {
  name: 'teambuilder-serverless'
  params: {
    location: location
    tagVersion: tagVersion
    functionAppName: htbFunctionAppName
    appServicePlanName: htbFuctionsAppPlanName
    functionStorageAccountName: htbFunctionAppStorageName
    appSettings: [
      {
        name: 'GitHubApiUrl'
        value: gitHubApi.outputs.url
      }
      {
        name: 'GitHubTeamId'
        value: gitHubTeamId
      }
      // {
      //   name: 'TeamBuilderApiUrl'
      //   value: teamBuilderApi.properties. // ??
      // }
    ]
  }
}

output functionAppName string = serverless.outputs.functionAppName
output appServiceAppName string = gitHubApi.outputs.appServiceAppName
