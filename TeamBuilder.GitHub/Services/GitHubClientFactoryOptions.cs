namespace TeamBuilder.GitHub.Services;

public class GitHubClientFactoryOptions
{
    public string KeyVaultSecretUri { get; set; }
    public string Org { get; set; }
    public string GitHubAppId { get; set; }
    public string ProductHeaderValue { get; set; }
    public string InstallationId { get; set; }
    public string TeamId { get; set; }
}
