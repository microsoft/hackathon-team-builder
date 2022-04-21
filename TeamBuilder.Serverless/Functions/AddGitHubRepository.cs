// Default URL for triggering event grid function in the local environment.
// http://localhost:7071/runtime/webhooks/EventGrid?functionName={functionname}
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
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
        _teamBuilderApiClient= teamBuilderApiClient;
    }

    [FunctionName("AddGitHubRepository")]
    public async Task RunAsync([EventGridTrigger]EventGridEvent eventGridEvent)
    {
        var teamBuilderTeam = eventGridEvent.Data as Models.Team;

        if (teamBuilderTeam == null) return;

        var gitHubTeam = await _gitHubApiClient.GetTeamAsync(_gitHubTeamId);

        if (gitHubTeam == null) return; // todo: throw exception

        var request = new CreateRepositoryRequest
        {
            RepositoryName = teamBuilderTeam.Name,
            Description = teamBuilderTeam.Description,
            Homepage =  string.Empty
        };

        await _gitHubApiClient.CreateRepositoryAsync(gitHubTeam.Id, request);

        // todo: write back to TeamBuilder the GitHub repository URL using TeamBuilderApiClient
    }
}