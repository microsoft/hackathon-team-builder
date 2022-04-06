param keyVaultName string
@secure()
param githubPrivateKeyVal string

resource kv 'Microsoft.KeyVault/vaults@2021-04-01-preview' = {
  name: keyVaultName
  location: resourceGroup().location
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
