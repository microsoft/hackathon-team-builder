namespace TeamBuilder.GitHub.Services;

/// <summary>
/// Options for configuring GitHub integration
/// </summary>
public class GitHubClientFactoryOptions
{
    /// <summary>
    /// Name of secret where private key file value is stored in KeyVault
    /// </summary>
    public string KeyVaultSecret { get; set; }
    /// <summary>
    /// GitHub organization name
    /// </summary>
    public string Org { get; set; }
    /// <summary>
    /// GitHub App ID
    /// </summary>
    public string GitHubAppId { get; set; }
    /// <summary>
    /// Name of the app on GitHub
    /// </summary>
    public string ProductHeaderValue { get; set; }
    /// <summary>
    /// ID of GitHub app installation on the organization in GitHub
    /// </summary>
    public string InstallationId { get; set; }
}
