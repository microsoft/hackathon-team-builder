using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using TeamBuilder.Serverless;

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

    }
}
