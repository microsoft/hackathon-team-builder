$requestScope = "api://localhost/5d6db6cd-cce5-47c4-8700-000efa22e068/.default"

## Get new token
az login
az account get-access-token --scope $requestScope --query accessToken