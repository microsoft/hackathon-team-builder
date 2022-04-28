$appId = "04b07795-8ddb-461a-bbee-02f9e1bf7b46" #global appId for az CLI
$apiId = "529a0eef-990b-4fa0-a94f-b1aa2bd4b5d0" #appId of teams app registration
$requestScope = "api://hackathonteambui6c1859.z19.web.core.windows.net/529a0eef-990b-4fa0-a94f-b1aa2bd4b5d0/.default"

## First time only
az login
az ad sp create --id $appId
az ad app permission grant --id $appId --api $apiId --scope "access_as_user"
az login --scope $requestScope