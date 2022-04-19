$appId = "04b07795-8ddb-461a-bbee-02f9e1bf7b46" #global appId for az CLI
$apiId = "5d6db6cd-cce5-47c4-8700-000efa22e068" #appId of teams app registration
$requestScope = "api://localhost/5d6db6cd-cce5-47c4-8700-000efa22e068/.default"

## First time only
az login
az ad sp create --id $appId
az ad app permission grant --id $appId --api $apiId --scope "access_as_user"
az login --scope $requestScope