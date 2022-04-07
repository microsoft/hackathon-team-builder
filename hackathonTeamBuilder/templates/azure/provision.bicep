param tagVersion string
param location string = resourceGroup().location
@secure()
param provisionParameters object
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
param keyVaultName string
@secure()
param githubPrivateKeyVal string
param htbFunctionAppName string
param htbFuctionsAppPlanName string
param htbFunctionAppStorageName string

module keyvaultProvision './provision/keyvault.bicep' = {
  name: 'keyvaultProvision'
  params: {
    tagVersion: tagVersion
    location: location
    keyVaultName: keyVaultName
    githubPrivateKeyVal: githubPrivateKeyVal
  }
}

output keyvaultProvisionOutput object = {
  kvName: keyvaultProvision.outputs.kvName
  githubPrivateKeyName: keyvaultProvision.outputs.githubPrivateKeyName
}

module serverlessProvision './provision/serverless.bicep' = {
  name: 'teambuilder-serverless'
  params: {
    location: location
    tagVersion: tagVersion
    functionAppName: htbFunctionAppName
    appServicePlanName: htbFuctionsAppPlanName
    functionStorageAccountName: htbFunctionAppStorageName
  }
}

output serverlessProvisionOutput object = {

}

// Resources for frontend hosting
module frontendHostingProvision './provision/frontendHosting.bicep' = {
  name: 'frontendHostingProvision'
  params: {
    tagVersion: tagVersion
    location: location
    provisionParameters: provisionParameters
  }
}

output frontendHostingOutput object = {
  teamsFxPluginId: 'fx-resource-frontend-hosting'
  domain: frontendHostingProvision.outputs.domain
  endpoint: frontendHostingProvision.outputs.endpoint
  storageResourceId: frontendHostingProvision.outputs.resourceId
}

// Resources for identity
module userAssignedIdentityProvision './provision/identity.bicep' = {
  name: 'userAssignedIdentityProvision'
  params: {
    tagVersion: tagVersion
    location: location
    provisionParameters: provisionParameters
  }
}

output identityOutput object = {
  teamsFxPluginId: 'fx-resource-identity'
  identityName: userAssignedIdentityProvision.outputs.identityName
  identityResourceId: userAssignedIdentityProvision.outputs.identityResourceId
  identityClientId: userAssignedIdentityProvision.outputs.identityClientId
}
// Resources for Simple Auth
module simpleAuthProvision './provision/simpleAuth.bicep' = {
  name: 'simpleAuthProvision'
  params: {
    tagVersion: tagVersion
    location: location
    provisionParameters: provisionParameters
    userAssignedIdentityId: userAssignedIdentityProvision.outputs.identityResourceId
  }
}

output simpleAuthOutput object = {
  teamsFxPluginId: 'fx-resource-simple-auth'
  endpoint: simpleAuthProvision.outputs.endpoint
  webAppResourceId: simpleAuthProvision.outputs.webAppResourceId
  serverFarmId: simpleAuthProvision.outputs.serverFarmId
}

module graphqlAPIProvision './provision/teambuilderApi.bicep' = {
  name: 'graphqlAPIProvision'
  params: {
    tagVersion: tagVersion
    location: location
    provisionParameters: provisionParameters
    serverFarmId: simpleAuthProvision.outputs.serverFarmId
    userAssignedIdentityId: userAssignedIdentityProvision.outputs.identityResourceId
  }
}

output graphqlAPIOutput object = {
  apiEndpoint: graphqlAPIProvision.outputs.apiEndpoint
  webAppResourceId: graphqlAPIProvision.outputs.webAppResourceId
  eventGridTopicName: graphqlAPIProvision.outputs.eventGridTopicName
}

module githubApiProvision './provision/githubApi.bicep' = {
  name: 'githubApiProvision'
  params: {
    tagVersion: tagVersion
    location: location
    provisionParameters: provisionParameters
    serverFarmId: simpleAuthProvision.outputs.serverFarmId
    userAssignedIdentityId: userAssignedIdentityProvision.outputs.identityResourceId
    githubOrg: githubOrg
    githubProductHeaderValue: githubProductHeaderValue
    githubInstallationId: githubInstallationId
    githubTeamId: githubTeamId
    keyVaultName: keyvaultProvision.outputs.kvName
    gitHubSecretName: keyvaultProvision.outputs.githubPrivateKeyName
    githubAppId: githubAppId
  }
}

output githubApiProvisionOutput object = {
  webAppResourceId: graphqlAPIProvision.outputs.webAppResourceId
}
