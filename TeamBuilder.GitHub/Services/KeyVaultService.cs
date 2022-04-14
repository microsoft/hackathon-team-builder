using Azure.Identity;
using Azure.Security.KeyVault.Secrets;

namespace TeamBuilder.GitHub.Services;

public class KeyVaultService
{
    private readonly IDictionary<string, string> _secrets;
    private readonly SecretClient _client;

    public KeyVaultService(string vaultUri)
    {
        var uri = new Uri(vaultUri);

        _client = new SecretClient(uri, new DefaultAzureCredential());
        _secrets = new Dictionary<string, string>();
    }

    public KeyVaultService(Uri vaultUri)
    {
        _client = new SecretClient(vaultUri, new DefaultAzureCredential());
        _secrets = new Dictionary<string, string>();
    }

    public async Task<string> GetSecretAsync(string secretName)
    {
        KeyVaultSecret secret = await _client.GetSecretAsync(secretName);

        return secret?.Value;
    }

    public async Task<string> GetSecretAsync(Uri secretUri)
    {
        var secretId = new KeyVaultSecretIdentifier(secretUri);

        return await GetSecretAsync(secretId.Name);
    }

    public async Task PersistSecretAsync(string secretName)
    {
        KeyVaultSecret secret = await _client.GetSecretAsync(secretName);

        _secrets.Add(secret.Name, secret.Value);
    }

    public async Task PersistSecretAsync(Uri secretUri)
    {
        var secretId = new KeyVaultSecretIdentifier(secretUri);

        await PersistSecretAsync(secretId.Name);
    }

    public string this[string key]
    {
        get
        {
            return _secrets.ContainsKey(key) ? _secrets[key] : null;
        }
    }
}
