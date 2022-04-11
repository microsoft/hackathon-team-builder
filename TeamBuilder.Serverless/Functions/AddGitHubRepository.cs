// Default URL for triggering event grid function in the local environment.
// http://localhost:7071/runtime/webhooks/EventGrid?functionName={functionname}
using Microsoft.Azure.EventGrid.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.EventGrid;
using Microsoft.Extensions.Logging;
using TeamBuilder.Models;

namespace TeamBuilder.Serverless.Functions;

public static class AddGitHubRepository
{
    [FunctionName("AddGitHubRepository")]
    public static void Run([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log)
    {
        //log.LogInformation(eventGridEvent.Data.ToString());

        //var appSetting = eventGridEvent.Data as AppSetting;

        //// only interested in changes to this appsetting where value is not null
        //if (appSetting == null || appSetting?.Setting != "GIT_HUB_ORG" || string.IsNullOrEmpty(appSetting?.Value))
        //    return; 

        // call github api to create repository and add to the org team
    }
}

//df500a57