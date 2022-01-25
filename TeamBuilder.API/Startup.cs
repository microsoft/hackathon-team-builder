using Azure.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Graph;
using TeamBuilder.API.Challenges;
using TeamBuilder.API.Common;
using TeamBuilder.API.Data;
using TeamBuilder.API.DataLoader;
using TeamBuilder.API.Services;
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
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddApplicationInsightsTelemetry(Configuration["APPINSIGHTS_CONNECTIONSTRING"]);

            services.AddPooledDbContextFactory<TeamBuilderDbContext>(options => options.UseSqlite("Data Source=teambuilder.db"));

            services.AddScoped<GraphServiceClient>(o =>
            {
                var config = new GraphClientConfiguration();
                Configuration.GetSection("GraphClient").Bind(config);
                var client = new GraphServiceClient(new ClientSecretCredential(config.TenantId, config.ClientId, config.ClientSecret));
                client.BaseUrl = "https://graph.microsoft.com/beta";
                return client;
            });

            services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                                  builder =>
                                  {
                                      builder//.WithOrigins("https://hackathonteambui6c1859.z19.web.core.windows.net")
                                        .AllowAnyOrigin()
                                        .AllowAnyHeader()
                                        .AllowAnyMethod();
                                  });
            });

            services.Configure<EventGridMessageServiceConfiguration>(Configuration.GetSection("EventGrid"));
            services.AddSingleton<IMessageService, EventGridMessageService>();

            services
                .AddGraphQLServer()
                .AddQueryType<Query>()
                    .AddTypeExtension<TeamMemberQueries>()
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

            app.UseCors(MyAllowSpecificOrigins);
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGraphQL();
            });
        }
    }
}
