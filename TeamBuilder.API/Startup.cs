using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Graph;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using TeamBuilder.API.Challenges;
using TeamBuilder.API.Data;
using TeamBuilder.API.DataLoader;
using TeamBuilder.API.TeamMembers;
using TeamBuilder.API.Teams;
using TeamBuilder.API.Types;

namespace TeamBuilder.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddPooledDbContextFactory<TeamBuilderDbContext>(options => options.UseSqlite("Data Source=teambuilder.db"));

            services.AddScoped<GraphServiceClient>(o =>
            {
                // Uses MSI to get access to GraphAPI
                var tokenProvider = new AzureServiceTokenProvider();
                var token = tokenProvider.GetAccessTokenAsync("https://graph.microsoft.com").Result;

                return new GraphServiceClient(new DelegateAuthenticationProvider(request =>
                {
                    request.Headers.Authorization = new AuthenticationHeaderValue("bearer", token);

                    return Task.CompletedTask;
                }));
            });

            services
                .AddGraphQLServer()
                .AddQueryType<Query>()
                .AddMutationType()
                    .AddTypeExtension<ChallengeMutations>()
                    .AddTypeExtension<TeamMutations>()
                    .AddTypeExtension<TeamMemberMutations>()
                .AddType<ChallengeType>()
                .AddType<TeamType>()
                .AddType<TeamMemberType>()
                .AddDataLoader<TeamByIdDataLoader>()
                .AddDataLoader<ChallengeByIdDataLoader>()
                .AddDataLoader<TeamMemberByTeamIdDataLoader>()
                .AddDataLoader<UserByIdDataLoader>()
                .AddSorting()
                .AddFiltering()
                ;
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGraphQL();
            });
        }
    }
}
