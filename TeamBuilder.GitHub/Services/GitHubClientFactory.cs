using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using GitHubJwt;
using Microsoft.Extensions.Options;
using Octokit;
using System.Globalization;

namespace TeamBuilder.GitHub.Services;

public class GitHubClientFactory
{
    private readonly long _installationId;
    private readonly GitHubJwtFactory _jwtFactory;
    private readonly ProductHeaderValue _productHeaderVal;
    internal string Org { get; set; }
    internal int TeamId { get; set; }


    public GitHubClientFactory(IOptions<GitHubClientFactoryOptions> options)
    {
        var secretUri = new Uri(options.Value.KeyVaultSecretUri);
        var secretId = new KeyVaultSecretIdentifier(secretUri);
        var gitHubAppId = int.Parse(options.Value.GitHubAppId, NumberStyles.Number);

        _productHeaderVal = new ProductHeaderValue(options.Value.ProductHeaderValue);
        _installationId = long.Parse(options.Value.InstallationId, NumberStyles.Number);

        var secretClient = new SecretClient(secretId.VaultUri, new DefaultAzureCredential());
        KeyVaultSecret secretResponse = secretClient.GetSecretAsync(secretId.Name, secretId.Version).Result;

        var secret = secretResponse.Value;

        Org = options.Value.Org;
        TeamId = int.Parse(options.Value.TeamId, NumberStyles.Number);

        _jwtFactory = new GitHubJwtFactory(
            new StringPrivateKeySource(secret),
            new GitHubJwtFactoryOptions
            {
                AppIntegrationId = gitHubAppId,
                ExpirationSeconds = 600 // 10 minutes is the maximum time allowed
            }
        );
    }

    internal async Task<GitHubClient> GetClientAsync()
    {
        var jwtToken = _jwtFactory.CreateEncodedJwtToken();

        var appClient = new GitHubClient(_productHeaderVal)
        {
            Credentials = new Credentials(jwtToken, AuthenticationType.Bearer)
        };

        var accessToken = await appClient.GitHubApps.CreateInstallationToken(_installationId);

        return new GitHubClient(_productHeaderVal)
        {
            Credentials = new Credentials(accessToken.Token, AuthenticationType.Bearer)
        };
    }
}
