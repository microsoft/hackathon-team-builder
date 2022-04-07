param tagVersion string
param location string = resourceGroup().location
@secure()
param provisionParameters object
var resourceBaseName = provisionParameters.resourceBaseName
var identityName = contains(provisionParameters, 'userAssignedIdentityName') ? provisionParameters['userAssignedIdentityName'] : '${resourceBaseName}'

var tagName = split(tagVersion, ':')[0]
var tagValue = split(tagVersion, ':')[1]

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
  name: identityName
  location: location
  tags: {
    '${tagName}': tagValue
  }
}

output identityName string = identityName
output identityClientId string = managedIdentity.properties.clientId
output identityResourceId string = managedIdentity.id
output identityPrincipalId string = managedIdentity.properties.principalId
