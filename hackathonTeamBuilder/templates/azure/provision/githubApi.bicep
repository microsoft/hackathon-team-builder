param tagVersion string
param location string = resourceGroup().location
@secure()
param provisionParameters object
param serverFarmId string
param userAssignedIdentityId string

// should any of these be @secure() ??
param githubOrg string
param githubAppId string
param githubProductHeaderValue string
param githubInstallationId string
param githubTeamId string
param keyVaultName string
param gitHubSecretName string

var githubApiName = 'TeambuilderAPI${uniqueString(resourceGroup().id)}'
var githubApiPackageUri = contains(provisionParameters, 'githubApiPackageUri') ? provisionParameters['githubApiPackageUri'] : 'https://github.com/microsoft/hackathon-team-builder/releases/download/v0.0.15/Teambuilder.API_0.0.15.zip'

var tagName = split(tagVersion, ':')[0]
var tagValue = split(tagVersion, ':')[1]

resource kv 'Microsoft.KeyVault/vaults@2021-04-01-preview' existing = {
  name: keyVaultName
}

resource githubApi 'Microsoft.Web/sites@2021-02-01' = {
  kind: 'app'
  name: githubApiName
  tags: {
    '${tagName}': tagValue
  }
  location: location
  properties: {
    serverFarmId: serverFarmId
    keyVaultReferenceIdentity: userAssignedIdentityId    
    httpsOnly: true
    siteConfig: {
      appSettings:  [
        {
          name: 'KeyVaultUri'
          value: '${kv.properties.vaultUri}'
        }
        {
          name: 'GitHub__KeyVaultSecret'
          value: gitHubSecretName
        }
        {
          name: 'GitHub__Org'
          value: githubOrg
        }
        {
          name: 'GitHub__GitHubAppId'
          value: githubAppId
        }
        {
          name: 'GitHub__ProductHeaderValue'
          value: githubProductHeaderValue
        }
        {
          name: 'GitHub__InstallationId'
          value: githubInstallationId
        }
        {
          name: 'GitHub__TeamId'
          value: githubTeamId
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
  parent: githubApi
  name: 'MSDeploy'
  properties: {
    packageUri: githubApiPackageUri
  }
}

// KeyVaultSecretsUser
resource kvRoleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid('4633458b-17de-408a-b874-0445c86b69e6',githubApi.id,kv.id)
  scope: kv
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')
    principalId: githubApi.id
    principalType: 'ServicePrincipal'
  }
}

output githubApiResourceId string = githubApi.id
