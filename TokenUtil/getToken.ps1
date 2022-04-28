$requestScope = "api://hackathonteambui6c1859.z19.web.core.windows.net/529a0eef-990b-4fa0-a94f-b1aa2bd4b5d0/.default"

## Get new token
az login
az account get-access-token --scope $requestScope --query accessToken