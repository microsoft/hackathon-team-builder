param tagVersion string
param location string = resourceGroup().location
param keyVaultName string
@secure()
param githubPrivateKeyVal string

var tagName = split(tagVersion, ':')[0]
var tagValue = split(tagVersion, ':')[1]

resource kv 'Microsoft.KeyVault/vaults@2021-04-01-preview' = {
  name: keyVaultName
  tags: {
    '${tagName}': tagValue
  }
  location: location
  properties: {
    enableRbacAuthorization: true
    tenantId: subscription().tenantId
    sku: {
      name: 'standard'
      family: 'A'
    }
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
}

// is there a way to do this in a list for all github secrets? would we even want to?
resource secret 'Microsoft.KeyVault/vaults/secrets@2021-04-01-preview' = {
  parent: kv
  name: 'githubapp-privatekey'
  tags: {
    '${tagName}': tagValue
  }
  properties: {
    value: githubPrivateKeyVal
  }
}

// todo: add someone as KeyVaultAdministrator?... or someTHING
// resource kvRoleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
//   name: guid('00482a5a-887f-4fb3-b363-3b7fe8e74483',objectId,kv.id)
//   scope: kv
//   properties: {
//     roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '00482a5a-887f-4fb3-b363-3b7fe8e74483')
//     principalId: objectId
//     principalType: 'ServicePrincipal'
//   }
// }

output kvName string = kv.name
output githubPrivateKeyName string = secret.name
