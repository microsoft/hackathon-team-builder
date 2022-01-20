@secure()
param provisionParameters object
param serverFarmId string
param userAssignedIdentityId string

var teambuilderApiName = 'TeambuilderAPI${uniqueString(resourceGroup().id)}'
var teambuilderPackageUri = contains(provisionParameters, 'teambuilderPackageUri') ? provisionParameters['teambuilderPackageUri'] : 'https://github.com/microsoft/hackathon-team-builder/releases/download/v0.0.12/Teambuilder.API_0.0.12.zip'

resource teambuilderApi 'Microsoft.Web/sites@2021-02-01' = {
  kind: 'app'
  name: teambuilderApiName
  location: resourceGroup().location
  properties: {
    serverFarmId: serverFarmId
    keyVaultReferenceIdentity: userAssignedIdentityId    
    httpsOnly: true
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${userAssignedIdentityId}': {}
    }
  }
}


resource teamBuilderApiDeploy 'Microsoft.Web/sites/extensions@2021-02-01' = {
  parent: teambuilderApi
  name: 'MSDeploy'
  properties: {
    packageUri: teambuilderPackageUri
  }
}

output apiEndpoint string = 'https://${teambuilderApi.properties.defaultHostName}'
output webAppResourceId string = teambuilderApi.id
