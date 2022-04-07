param tagVersion string
param location string = resourceGroup().location
param functionAppName string
param appServicePlanName string
param functionStorageAccountName string

var appInsightsName = '${functionAppName}-ai'

// todo: add event grid connection
var tagName = split(tagVersion, ':')[0]
var tagValue = split(tagVersion, ':')[1]

resource functionStorageAccount 'Microsoft.Storage/storageAccounts@2021-06-01' = {
  name: functionStorageAccountName
  location: location
  tags: {
    'ObjectName': functionAppName
    '${tagName}': tagValue
  }
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: appInsightsName
  location: location
  tags: {
    'ObjectName': functionAppName
    '${tagName}': tagValue
  }
  kind: 'web'
  properties: {
    Application_Type: 'web'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

resource plan 'Microsoft.Web/serverfarms@2020-12-01' = {
  name: appServicePlanName
  location: location
  tags: {
    '${tagName}': tagValue
  }
  kind: 'functionapp'
  sku: {
    name: 'Y1'
  }
}

resource functionApp 'Microsoft.Web/sites@2020-12-01' = {
  name: functionAppName
  location: location
  kind: 'functionapp'
  tags: {
    '${tagName}': tagValue
  }
  properties: {
    siteConfig: {
      appSettings: [
        {
          name: 'AzureWebJobsStorage'
          value: 'DefaultEndpointsProtocol=https;AccountName=${functionStorageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${listKeys(functionStorageAccount.id, functionStorageAccount.apiVersion).keys[0].value}'
        }
        {
          name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING'
          value: 'DefaultEndpointsProtocol=https;AccountName=${functionStorageAccount.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${listKeys(functionStorageAccount.id, functionStorageAccount.apiVersion).keys[0].value}'
        }
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'dotnet'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~4'
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsights.properties.InstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: 'InstrumentationKey=${appInsights.properties.InstrumentationKey}'
        }
      ]
    }
    httpsOnly: true
  }
}

output functionAppUrl string = 'https://${functionApp.properties.defaultHostName}'
output functionAppName string = functionApp.name
