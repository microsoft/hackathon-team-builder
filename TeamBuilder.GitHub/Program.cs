using Newtonsoft.Json.Serialization;
using TeamBuilder.GitHub;
using TeamBuilder.GitHub.Services;

var builder = WebApplication.CreateBuilder(args);

var options = builder.Configuration.GetSection("GitHub").Get<GitHubClientFactoryOptions>();
var kvUri = builder.Configuration.GetValue<string>("KeyVaultUri");
var userAssignedClientId = builder.Configuration.GetValue<string>("UserAssignedClientId");
var keyVaultService = new KeyVaultService(kvUri, userAssignedClientId);

await keyVaultService.PersistSecretAsync(options.KeyVaultSecret);

builder.Services.AddSingleton(options);
builder.Services.AddSingleton(keyVaultService);
builder.Services.AddScoped<GitHubClientFactory>();

builder.Services.AddControllers().AddNewtonsoftJson(jsonOptions =>
{
    jsonOptions.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
    jsonOptions.SerializerSettings.Converters.Add(new PermissionLevelJsonConverter());
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();