param tagVersion string = 'htb-version:v2.4.0'
param location string = resourceGroup().location

@secure()
param provisionParameters object

module provision './provision.bicep' = {
  name: 'provisionResources'
  params: {
    tagVersion: tagVersion
    provisionParameters: provisionParameters
    location: location    
  }
}

module teamsFxConfig './config.bicep' = {
  name: 'addTeamsFxConfigurations'
  params: {
    provisionParameters: provisionParameters
    provisionOutputs: provision
  }
}

output provisionOutput object = provision
output teamsFxConfigurationOutput object = contains(reference(resourceId('Microsoft.Resources/deployments', teamsFxConfig.name), '2020-06-01'), 'outputs') ? teamsFxConfig : {}
