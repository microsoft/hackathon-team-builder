using Azure.Identity;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Graph;
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
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddPooledDbContextFactory<TeamBuilderDbContext>(options => options.UseSqlite("Data Source=teambuilder.db"));

            services.AddScoped<GraphServiceClient>(o =>
            {
                // Uses MSI to get access to GraphAPI
                return new GraphServiceClient(new DefaultAzureCredential());
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
