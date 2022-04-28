param tagVersion string
param location string = resourceGroup().location
@secure()
param provisionParameters object

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

// Resources for Azure Functions
module functionProvision './provision/function.bicep' = {
  name: 'functionProvision'
  params: {
    tagVersion: tagVersion
    location: location
    provisionParameters: provisionParameters
    userAssignedIdentityId: userAssignedIdentityProvision.outputs.identityResourceId
  }
}

output functionOutput object = {
  teamsFxPluginId: 'fx-resource-function'
  functionAppResourceId: functionProvision.outputs.functionAppResourceId
  functionEndpoint: functionProvision.outputs.functionEndpoint
}
