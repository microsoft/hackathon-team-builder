using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;

Console.WriteLine("<--TeamBuilder.API token generator-->");

var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json");

IConfiguration configuration = builder.Build();

var application = PublicClientApplicationBuilder.Create(configuration["ClientId"])
    .WithAuthority(string.Concat(configuration["Instance"], configuration["TenantId"]))
    .WithDefaultRedirectUri()
    .Build();

AuthenticationResult result;
string[] scopes = new[] { configuration["DefaultScope"] };


result = await application.AcquireTokenWithDeviceCode(scopes, deviceCodeResult =>
{
    Console.WriteLine(deviceCodeResult.Message);
    return Task.FromResult(0);
}).ExecuteAsync();

Console.WriteLine(result.AccessToken);