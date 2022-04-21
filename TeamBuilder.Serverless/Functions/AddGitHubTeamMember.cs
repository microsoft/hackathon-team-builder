// Default URL for triggering event grid function in the local environment.
// http://localhost:7071/runtime/webhooks/EventGrid?functionName={functionname}
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using System;
using System.Threading.Tasks;
using TeamBuilder.Serverless.Services;

namespace TeamBuilder.Serverless.Functions;

public class AddGitHubTeamMember
{
    private readonly GitHubApiClient _gitHubApiClient;
    private readonly TeamBuilderApiClient _teamBuilderApiClient;
    private readonly int _gitHubTeamId;

    public AddGitHubTeamMember(GitHubApiClient gitHubApiClient, TeamBuilderApiClient teamBuilderApiClient)
    {
        // currently mapping many teambuilder teams to one github team in the github org
        var teamIdStr = Environment.GetEnvironmentVariable("GitHubTeamId");

        _gitHubTeamId = int.Parse(teamIdStr);

        _gitHubApiClient = gitHubApiClient;
        _teamBuilderApiClient = teamBuilderApiClient;
    }

    [FunctionName("AddGitHubTeamMember")]
    public async Task RunAsync([EventGridTrigger]EventGridEvent eventGridEvent)
    {
        var teamBuilderUser = eventGridEvent.Data as Models.TeamMember;

        if(teamBuilderUser == null) return;

        // todo: capture github login during team member add in team builder and use here

        var gitHubLogin = string.Empty;

        await _gitHubApiClient.AddTeamMemberAsync(_gitHubTeamId, gitHubLogin);
    }
}
