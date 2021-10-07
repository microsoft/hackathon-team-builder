using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TeamBuilder.API.Data;
using TeamBuilder.API.DataLoader;
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

            services
                .AddGraphQLServer()
                .AddQueryType<Query>()
                .AddMutationType<Mutation>()
                .AddType<ChallengeType>()
                .AddType<TeamType>()
                .AddDataLoader<TeamByIdDataLoader>()
                .AddDataLoader<ChallengeByIdDataLoader>()
                .AddDataLoader<TeamMemberByTeamIdDataLoader>()
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
