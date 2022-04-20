using Microsoft.AspNetCore.Mvc;
using Octokit;
using TeamBuilder.GitHub.Services;

namespace TeamBuilder.GitHub.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TeamsController : ControllerBase
{
    private readonly GitHubClientFactory _factory;

    public TeamsController(GitHubClientFactory factory)
    {
        _factory = factory;
    }

    /// <summary>
    /// Retrieve all GitHub Teams
    /// </summary>
    /// <remarks>The application is currently designed to only have one team setup in GitHub and have all repositories and Hackathon team builders assigned so this endpoint will always currently return one team in the list</remarks>
    /// <returns></returns>
    [HttpGet(Name = nameof(GetTeamsAsync))]
    [ProducesResponseType(typeof(List<Team>), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<List<Team>>> GetTeamsAsync()
    {
        var client = await _factory.GetClientAsync();

        var team = await client.Organization.Team.GetAll(_factory.Org);

        if (team == null)
            return NotFound();

        return Ok(team);
    }

    /// <summary>
    /// Retreieve a team
    /// </summary>
    /// <param name="teamId"></param>
    /// <remarks>Fetches a team by the team's id in GitHub. Teams belong to organizations. Currently the application is only designed to run against one organization at a time by configuration.</remarks>
    /// <returns></returns>
    [HttpGet("{teamId}", Name = nameof(GetTeamAsync))]
    [ProducesResponseType(typeof(Team), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<Team>> GetTeamAsync([FromRoute] int teamId)
    {
        var client = await _factory.GetClientAsync();

        var team = await client.Organization.Team.Get(teamId);

        if (team == null)
            return NotFound();

        return Ok(team);
    }
}
