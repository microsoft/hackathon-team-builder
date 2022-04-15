// See https://aka.ms/new-console-template for more information
using Microsoft.Identity.Client;

Console.WriteLine("<--TeamBuilder.API token generator-->");

var application = PublicClientApplicationBuilder.Create("be5398d9-de1e-4fb5-bcc1-46e940a8c7b6")
    .WithAuthority("https://login.microsoftonline.com/2e6a1980-3b67-497b-90c1-b8a3409dfa64")
    .WithDefaultRedirectUri()
    .Build();

AuthenticationResult result;
string[] scopes = new[] { "api://localhost/5d6db6cd-cce5-47c4-8700-000efa22e068/access_as_user" };


result = await application.AcquireTokenWithDeviceCode(scopes, deviceCodeResult =>
{
    Console.WriteLine(deviceCodeResult.Message);
    return Task.FromResult(0);
}).ExecuteAsync();

Console.WriteLine(result.AccessToken);