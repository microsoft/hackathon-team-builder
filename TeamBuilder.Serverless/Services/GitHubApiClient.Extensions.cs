using Newtonsoft.Json;

namespace TeamBuilder.Serverless.Services
{
    partial class GitHubApiClient
    {
        partial void UpdateJsonSerializerSettings(JsonSerializerSettings settings)
        {
            settings.Converters.Add(new PermissionLevelStingEnumJsonConverter());
        }
    }
}
