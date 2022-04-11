param prefix string = 'htb-${uniqueString(resourceGroup().id)}'
param tagVersion string = 'htb-version:v1.2.0'
param location string = resourceGroup().location

@secure()
param githubOrg string
@secure()
param githubProductHeaderValue string
@secure()
param githubInstallationId string
@secure()
param githubTeamId string
@secure()
param githubAppId string
@secure()
param githubPrivateKeyVal string

var cleanPrefix = replace(prefix, '-', '')
var htbFunctionAppName = '${prefix}-serverless'
var htbFuctionsAppPlanName = '${prefix}-serverlessPlan'
var htbFunctionAppStorageName = length(cleanPrefix) + 6 > 24 ? substring('${cleanPrefix}funcsa',0,24) : '${cleanPrefix}funcsa'
var keyVaultName = length(cleanPrefix) + 2 > 24 ? substring('${cleanPrefix}kv',0,24) : '${cleanPrefix}kv'

@secure()
param provisionParameters object

module provision './provision.bicep' = {
  name: 'provisionResources'
  params: {
    tagVersion: tagVersion
    provisionParameters: provisionParameters
    location: location
    keyVaultName: keyVaultName
    githubPrivateKeyVal: githubPrivateKeyVal
    htbFunctionAppName: htbFunctionAppName
    htbFuctionsAppPlanName: htbFuctionsAppPlanName
    htbFunctionAppStorageName: htbFunctionAppStorageName

    githubOrg: githubOrg
    githubProductHeaderValue: githubProductHeaderValue
    githubInstallationId: githubInstallationId
    githubTeamId: githubTeamId
    githubAppId: githubAppId
  }
}

module teamsFxConfig './config.bicep' = {
  name: 'addTeamsFxConfigurations'
  params: {
    provisionParameters: provisionParameters
    provisionOutputs: provision
  }
}

output provisionOutput object = provision
output teamsFxConfigurationOutput object = contains(reference(resourceId('Microsoft.Resources/deployments', teamsFxConfig.name), '2020-06-01'), 'outputs') ? teamsFxConfig : {}
