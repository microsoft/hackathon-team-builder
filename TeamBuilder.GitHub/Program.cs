using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Reflection;
using TeamBuilder.GitHub;
using TeamBuilder.GitHub.Middleware;
using TeamBuilder.GitHub.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<GitHubClientFactoryOptions>(builder.Configuration.GetSection("GitHub"));
builder.Services.AddSingleton(sp => {
    var kvUri = builder.Configuration.GetValue<string>("KeyVaultUri");

    var keyVaultService = new KeyVaultService(kvUri);

    var options = sp.GetRequiredService<IOptions<GitHubClientFactoryOptions>>();

    keyVaultService.PersistSecret(options.Value.KeyVaultSecret);

    return keyVaultService;
});
builder.Services.AddScoped<GitHubClientFactory>();

builder.Services.AddControllers().AddNewtonsoftJson(jsonOptions =>
{
    jsonOptions.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
    jsonOptions.SerializerSettings.Converters.Add(new PermissionLevelJsonConverter());
    jsonOptions.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;

});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(o =>
{
    
    o.IncludeXmlComments(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, $"{Assembly.GetAssembly(typeof(Program)).GetName().Name}.xml"));
    o.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = $"{Assembly.GetAssembly(typeof(Program)).GetName().Name}",
        Version = "v1"
    });
});

var app = builder.Build();

app.UseMiddleware<ExceptionHandler>();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();