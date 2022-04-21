using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Net.Http;
using TeamBuilder.Serverless;
using TeamBuilder.Serverless.Services;

[assembly: FunctionsStartup(typeof(Startup))]
namespace TeamBuilder.Serverless;

public class Startup : FunctionsStartup
{

    public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)
    {
        FunctionsHostBuilderContext context = builder.GetContext();

        builder.ConfigurationBuilder
            .SetBasePath(context.ApplicationRootPath)
            .AddEnvironmentVariables();
    }

    public override void Configure(IFunctionsHostBuilder builder)
    {
        var gitHubApiUrlStr = Environment.GetEnvironmentVariable("GitHubApiUrl");
        var teamBuilderApiUrlStr = Environment.GetEnvironmentVariable("TeamBuilderApiUrl");

        builder.Services.AddScoped(o => new GitHubApiClient(gitHubApiUrlStr, new HttpClient()));
        builder.Services.AddScoped(o => new TeamBuilderApiClient(gitHubApiUrlStr));
    }
}
