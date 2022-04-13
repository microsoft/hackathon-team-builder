// Import polyfills for fetch required by msgraph-sdk-javascript.
require("isomorphic-fetch");
const teamsfxSdk = require("@microsoft/teamsfx");

/**
 * @param {Context} context - The Azure Functions context object.
 * @param {HttpRequest} req - The HTTP request.
 * @param {teamsfxContext} { [key: string]: any; } - The context generated by teamsfx binding.
 */
module.exports = async function (context, req, teamsfxContext) {
  context.log("HTTP trigger function processed a request.");

  // Initialize response.
  const res = {
    status: 201,
    body: {},
  };

  /**
   * Incoming request payload
   * {
   *   groupId: M365 groupId of Team
   *   channel: {
   *     displayName: "Channel Name",
   *     description: "Channel description",
   *     membershipType: "standard" | "private"
   *   }
   * }
   */
  const createChannelInput = req.body || {};
  const accessToken = teamsfxContext["AccessToken"];
  
  if (!accessToken) {
    return {
      status: 400,
      body: {
        error: "No access token was found in request header.",
      },
    };
  }

  let teamsFx;
  // Create a graph client to create a new channel.
  try {
    teamsFx = new teamsfxSdk.TeamsFx("Application");
    const graphClient = teamsfxSdk.createMicrosoftGraphClient(teamsFx, [".default"]);
    const channel = await graphClient.api(`/teams/${createChannelInput.groupId}/channels`).post(createChannelInput.channel);
    res.body.graphClientMessage = channel;
  } catch (e) {
    context.log.error(e);
    return {
      status: 500,
      body: {
        error:
          "Failed to create the Teams Channel. The application may not be authorized.",
      },
    };
  }

  return res;
};
