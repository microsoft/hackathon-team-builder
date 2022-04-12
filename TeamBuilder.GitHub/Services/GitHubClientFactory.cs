using GitHubJwt;
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

    public GitHubClientFactory(GitHubClientFactoryOptions options, KeyVaultService keyVaultService)
    {
        var gitHubAppId = int.Parse(options.GitHubAppId, NumberStyles.Number);

        _productHeaderVal = new ProductHeaderValue(options.ProductHeaderValue);
        _installationId = long.Parse(options.InstallationId, NumberStyles.Number);

        Org = options.Org;

        _jwtFactory = new GitHubJwtFactory(
            new StringPrivateKeySource(keyVaultService[options.KeyVaultSecret]),
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
