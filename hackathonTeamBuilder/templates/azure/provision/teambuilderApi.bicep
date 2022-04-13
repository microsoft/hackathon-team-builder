param tagVersion string
param location string = resourceGroup().location
@secure()
param provisionParameters object
param serverFarmId string
param userAssignedIdentityId string

var teambuilderApiName = 'TeambuilderAPI${uniqueString(resourceGroup().id)}'
var teambuilderPackageUri = contains(provisionParameters, 'teambuilderPackageUri') ? provisionParameters['teambuilderPackageUri'] : 'https://github.com/microsoft/hackathon-team-builder/releases/download/v2.3.0/Teambuilder.API_2.3.0.zip'
var teambuilderEventGridTopicName = 'TeambuilderEventGrid${uniqueString(resourceGroup().id)}'

var tagName = split(tagVersion, ':')[0]
var tagValue = split(tagVersion, ':')[1]

resource teambuilderEventGridTopic 'Microsoft.EventGrid/topics@2021-12-01' = {
  name: teambuilderEventGridTopicName
  location: location
  tags: {
    '${tagName}': tagValue
  }
  identity: {
    type: 'None'
  }
  properties: {
    inputSchema: 'EventGridSchema'
    publicNetworkAccess: 'Enabled'
    disableLocalAuth: false
  }
}

resource teambuilderApi 'Microsoft.Web/sites@2021-02-01' = {
  kind: 'app'
  name: teambuilderApiName
  location: location
  tags: {
    '${tagName}': tagValue
  }
  properties: {
    serverFarmId: serverFarmId
    keyVaultReferenceIdentity: userAssignedIdentityId    
    httpsOnly: true
    siteConfig: {
      appSettings:  [
        {
          name: 'EventGrid:AccessKey'
          value: teambuilderEventGridTopic.listKeys().key1
        }
        {
          name: 'EventGrid:Endpoint'
          value: teambuilderEventGridTopic.properties.endpoint
        }
      ]
    }
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
output eventGridTopicName string = teambuilderEventGridTopic.name
output webAppResourceId string = teambuilderApi.id
