param location string
param tagVersion string
param identityName string
param keyVaultName string
param appPlanName string
param appName string
param appSettings array

@allowed([
  'nonprod'
  'prod'
])
param environmentType string

var appServicePlanSkuName = (environmentType == 'prod') ? 'P2_v2' : 'B1'
var appServicePlanTierName = (environmentType == 'prod') ? 'PremiumV2' : 'Basic'

var tagName = split(tagVersion, ':')[0]
var tagValue = split(tagVersion, ':')[1]

var keyVaultSecretsUserRoleDefinitionId = '4633458b-17de-408a-b874-0445c86b69e6'

resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2018-11-30' = {
  name: identityName
  location: location
  tags: {
    '${tagName}': tagValue
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2021-01-15' = {
  name: appPlanName
  location: location
  tags: {
    '${tagName}': tagValue
  }
  sku: {
    name: appServicePlanSkuName
    tier: appServicePlanTierName
  }
  kind: 'Linux'
  properties: {
    reserved: true
  }
}

resource kv 'Microsoft.KeyVault/vaults@2021-04-01-preview' existing = {
  name: keyVaultName
}

resource kvRoleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(keyVaultSecretsUserRoleDefinitionId,managedIdentity.id,kv.id)
  scope: kv
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', keyVaultSecretsUserRoleDefinitionId)
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

resource appServiceApp 'Microsoft.Web/sites@2021-01-15' = {
  name: appName
  location: location
  tags: {
    '${tagName}': tagValue
  }
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    keyVaultReferenceIdentity: managedIdentity.id    
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|6.0'
      appSettings: concat(appSettings, [
        {
          name: 'UserAssignedClientId'
          value: managedIdentity.properties.clientId
        }
      ])
    }
  }
}

output appServiceAppName string = appServiceApp.name
