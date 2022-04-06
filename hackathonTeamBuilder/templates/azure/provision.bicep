@secure()
param provisionParameters object

module keyvaultProvision './provision/keyvault.bicep' = {
  name: 'keyvaultProvision'
  params: {
    keyVaultName: '' // todo: generate from see in main
    githubPrivateKeyVal: '' // todo: get from github secret
  }
}

output keyvaultProvisionOutput object = {
  kvName: keyvaultProvision.outputs.kvName
}

module serverlessProvision './provision/serverless.bicep' = {
  name: ''
  params: {
    functionAppName: ''
    appServicePlanName: ''
    functionStorageAccountName: ''
  }
}

output serverlessProvisionOutput object = {

}

// Resources for frontend hosting
module frontendHostingProvision './provision/frontendHosting.bicep' = {
  name: 'frontendHostingProvision'
  params: {
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
    provisionParameters: provisionParameters
    serverFarmId: simpleAuthProvision.outputs.serverFarmId
    userAssignedIdentityId: userAssignedIdentityProvision.outputs.identityResourceId
    githubOrg: ''
    githubProductHeaderValue: ''
    githubInstallationId: ''
    githubTeamId: ''
    keyVaultName: keyvaultProvision.outputs.kvName
    gitHubSecretName: ''
    githubAppId: ''
  }
}

output githubApiProvisionOutput object = {
  webAppResourceId: graphqlAPIProvision.outputs.webAppResourceId
}
