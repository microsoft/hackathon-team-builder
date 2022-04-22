// Default URL for triggering event grid function in the local environment.
// http://localhost:7071/runtime/webhooks/EventGrid?functionName={functionname}
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using TeamBuilder.Serverless.Services;

namespace TeamBuilder.Serverless.Functions;

public class AddGitHubRepository
{
    private readonly GitHubApiClient _gitHubApiClient;
    private readonly TeamBuilderApiClient _teamBuilderApiClient;
    private readonly int _gitHubTeamId;

    public AddGitHubRepository(GitHubApiClient gitHubApiClient, TeamBuilderApiClient teamBuilderApiClient)
    {
        // currently mapping many teambuilder teams to one github team in the github org
        var teamIdStr = Environment.GetEnvironmentVariable("GitHubTeamId");

        _gitHubTeamId = int.Parse(teamIdStr);

        _gitHubApiClient = gitHubApiClient;
        _teamBuilderApiClient = teamBuilderApiClient;
    }

    [FunctionName("AddGitHubRepository")]
    public async Task RunAsync([EventGridTrigger] EventGridEvent eventGridEvent, ILogger logger)
    {
        try
        {
            var json = eventGridEvent.Data.ToString();

            var teamBuilderTeam = JsonConvert.DeserializeObject<Models.Team>(json);

            if (teamBuilderTeam == null)
                throw new Exception($"Cannot read {eventGridEvent.Data} as a Team");

            var gitHubTeam = await _gitHubApiClient.GetTeamAsync(_gitHubTeamId);

            if (gitHubTeam == null)
                throw new Exception($"Could not find GitHub team with ID {_gitHubTeamId}");

            var request = new CreateRepositoryRequest
            {
                RepositoryName = teamBuilderTeam.Name,
                Description = teamBuilderTeam.Description,
                Homepage = string.Empty
            };

            await _gitHubApiClient.CreateRepositoryAsync(gitHubTeam.Id, request);

            // todo: write back to TeamBuilder the GitHub repository URL using TeamBuilderApiClient
        }
        catch (Exception ex)
        {
            if (!string.IsNullOrWhiteSpace(ex?.Message))
                logger.LogError(ex.Message);

            if (!string.IsNullOrWhiteSpace(ex?.InnerException?.Message))
                logger.LogError(ex.InnerException.Message);

            throw;
        }
    }
}