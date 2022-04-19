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
    public string Org { get; set; }
    public int TeamId { get; set; }

    public GitHubClientFactory(IOptions<GitHubClientFactoryOptions> options, KeyVaultService keyVaultService)
    {
        var gitHubAppId = int.Parse(options.Value.GitHubAppId, NumberStyles.Number);

        _productHeaderVal = new ProductHeaderValue(options.Value.ProductHeaderValue);
        _installationId = long.Parse(options.Value.InstallationId, NumberStyles.Number);

        Org = options.Value.Org;

        _jwtFactory = new GitHubJwtFactory(
            new StringPrivateKeySource(keyVaultService[options.Value.KeyVaultSecret]),
            new GitHubJwtFactoryOptions
            {
                AppIntegrationId = gitHubAppId,
                ExpirationSeconds = 600 // 10 minutes is the maximum time allowed
            }
        );
    }

    public async Task<GitHubClient> GetClientAsync()
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
