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


    public GitHubClientFactory(IOptions<KeyVaultOptions> keyVaultOptions, IOptions<GitHubClientFactoryOptions> options)
    {
        var secretUri = new Uri(options.Value.KeyVaultSecretUri);

        var secretId = new KeyVaultSecretIdentifier(secretUri);

        //var clientCertificateCredential = new ClientSecretCredential(keyVaultOptions.Value.TenantId, keyVaultOptions.Value.ClientId, keyVaultOptions.Value.Secret);

        var secretClient = new SecretClient(secretId.VaultUri, new DefaultAzureCredential());

        KeyVaultSecret secretResponse;

        secretResponse = secretClient.GetSecretAsync(secretId.Name, secretId.Version).Result;

        var secret = secretResponse.Value;

        _productHeaderVal = new ProductHeaderValue(options.Value.ProductHeaderValue);

        var gitHubAppId = int.Parse(options.Value.GitHubAppId, NumberStyles.Number);

        _installationId = long.Parse(options.Value.InstallationId, NumberStyles.Number);
        Org = options.Value.Org;
        // todo: get team id programmatically then place in secrets.json
        // TeamId = int.Parse(options.Value.TeamId, NumberStyles.Number);

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

        var gitHubClient = new GitHubClient(_productHeaderVal)
        {
            Credentials = new Credentials(jwtToken, AuthenticationType.Bearer)
        };

        var accessToken = await gitHubClient.GitHubApps.CreateInstallationToken(_installationId);

        var client = new GitHubClient(_productHeaderVal)
        {
            Credentials = new Credentials(accessToken.Token, AuthenticationType.Bearer)
        };

        var orgs = await gitHubClient.Organization.GetAllForCurrent();

        var orgName = orgs.FirstOrDefault()?.Name;

        var teams = await gitHubClient.Organization.Team.GetAllForCurrent();

        var teamId = teams.FirstOrDefault()?.Id;

        //var teams = await gitHubClient.Organization.Team.GetAll(Org);

        //var teamId = teams.FirstOrDefault()?.Id;

        return client;
    }
}
