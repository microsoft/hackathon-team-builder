# TokenUtil
This simple console app can generate a JWT bearer token for API testing with tools like Postman or Banana Cake Pop (GraphQL).

## Getting Started
1. Create a new App Registration in AzureAD and add API permissions to the app you want to test.
2. Edit the manifest and set `"allowPublicClient": true,`
3. Update the [appsettings.json](appsettings.json) file with your values.
```JSON
{
  "Instance": "https://login.microsoftonline.com/",
  "ClientId": "your app id from step 1",
  "TenantId": "your AzureAD tenant id",
  "DefaultScope": "scope of API you are testing"
}
```

To find the `DefaultScope` value, go to your app registration from step 1, then API Permissions. Click on the name of the permission you added for your API. Copy the full URI value of the scope.
(i.e. `api://localhost/5d6db6cd-cce5-47c4-8700-000efa22e068/access_as_user`)

## Run the app
After completing the getting started section, run the app with Visual Studio or using `dotnet run`. Follow the on-screen instructions to complete the Device Login flow. Your token will be output to the screen. Copy the full token and use wherever you need to test your API calls.