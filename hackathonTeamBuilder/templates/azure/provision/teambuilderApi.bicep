@secure()
param provisionParameters object
param serverFarmId string
param userAssignedIdentityId string

var teambuilderApiName = 'TeambuilderAPI${uniqueString(resourceGroup().id)}'
var teambuilderPackageUri = contains(provisionParameters, 'teambuilderPackageUri') ? provisionParameters['teambuilderPackageUri'] : 'https://github.com/microsoft/hackathon-team-builder/releases/download/v0.0.11/Teambuilder.API_0.0.11.zip'
var teambuilderDbServerName = contains(provisionParameters, 'teambuilderDbServerName') ? provisionParameters['teambuilderDbServerName'] : '${uniqueString(resourceGroup().id)}dbserver'
var adminLogin = contains(provisionParameters, 'sqlAadAdminLogin') ? provisionParameters['sqlAadAdminLogin'] : ''
var adminSid = contains(provisionParameters, 'sqlAadAdminSid') ? provisionParameters['sqlAadAdminSid'] : ''
var adminTenantId = contains(provisionParameters, 'sqlAadAdminTenantId') ? provisionParameters['sqlAadAdminTenantId'] : ''

resource teambuilderSql 'Microsoft.Sql/servers@2021-05-01-preview' = {
  name: teambuilderDbServerName
  location: resourceGroup().location
  properties: {
    administrators: {
      administratorType: 'ActiveDirectory'
      principalType: 'User'
      login: adminLogin
      sid: adminSid
      tenantId: adminTenantId
      azureADOnlyAuthentication: true
    }
    version: '12.0'
    publicNetworkAccess: 'Enabled'
    restrictOutboundNetworkAccess: 'Disabled'      
  }
}

resource teambuilderDb 'Microsoft.Sql/servers/databases@2021-05-01-preview' = {
  name: '${teambuilderSql.name}/TeamBuilder.API_db'
  location: resourceGroup().location
  sku: {
    name: 'Standard'
    tier: 'Standard'
    capacity: 10
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 1073741824
    createMode: 'Default'
    zoneRedundant: false
    readScale: 'Disabled'
    isLedgerOn: false    
  }
  
}

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
output sqlHostName string = '${teambuilderSql.name}${environment().suffixes.sqlServerHostname}'
output sqlDatabaseResourceId string = teambuilderDb.id
