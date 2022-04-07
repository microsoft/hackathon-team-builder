// Default URL for triggering event grid function in the local environment.
// http://localhost:7071/runtime/webhooks/EventGrid?functionName={functionname}
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Extensions.Logging;

namespace TeamBuilder.Serverless.Functions;

public static class AddGitHubTeamMember
{
    [FunctionName("AddGitHubTeamMember")]
    public static void Run([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log)
    {
        log.LogInformation(eventGridEvent.Data.ToString());

        eventGridEvent.Data = eventGridEvent.Data.ToString();

        // todo: read model from data

        // call GitHub API

        // anything else?

        // generate service from swagger json once github api is deployed

        // determine how to emulate properly with azurite
    }
}
