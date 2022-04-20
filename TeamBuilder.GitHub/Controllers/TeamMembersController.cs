using Microsoft.AspNetCore.Mvc;
using Octokit;
using TeamBuilder.GitHub.Services;

namespace TeamBuilder.GitHub.Controllers;

[ApiController]
[Route("Teams/{teamId}/[controller]")]
public class TeamMembersController : ControllerBase
{
    private readonly GitHubClientFactory _factory;

    public TeamMembersController(GitHubClientFactory factory)
    {
        _factory = factory;
    }

    /// <summary>
    /// Get all team members
    /// </summary>
    /// <param name="teamId"></param>
    /// <remarks>Get all team members based on the provided team ID</remarks>
    /// <returns></returns>
    [HttpGet("Members", Name = nameof(GetTeamMembersAsync))]
    [ProducesResponseType(typeof(List<User>), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<List<User>>> GetTeamMembersAsync([FromRoute] int teamId)
    {
        var client = await _factory.GetClientAsync();

        var teamMembers = await client.Organization.Team.GetAllMembers(teamId);

        if (teamMembers == null)
            return NotFound();

        return Ok(teamMembers);
    }

    /// <summary>
    /// Add a team member
    /// </summary>
    /// <param name="teamId"></param>
    /// <param name="login"></param>
    /// <remarks>Adds an existing GitHub user to an existing GitHub team</remarks>
    /// <returns></returns>
    [HttpPost("Members", Name = nameof(AddTeamMemberAsync))]
    [ProducesResponseType(204)]
    public async Task<IActionResult> AddTeamMemberAsync([FromRoute] int teamId, [FromBody] string login)
    {
        var client = await _factory.GetClientAsync();

        await client.Organization.Team.AddOrEditMembership(teamId, login, new UpdateTeamMembership(TeamRole.Member));

        return NoContent();
    }

    /// <summary>
    /// Remove a team member
    /// </summary>
    /// <param name="teamId"></param>
    /// <param name="login"></param>
    /// <remarks>Removes a GitHub user from a GitHub team to which they currently belong.</remarks>
    /// <returns></returns>
    [HttpDelete("Members/{login}", Name = nameof(RemoveTeamMemberAsync))]
    [ProducesResponseType(204)]
    public async Task<IActionResult> RemoveTeamMemberAsync([FromRoute] int teamId, [FromRoute] string login)
    {
        var client = await _factory.GetClientAsync();

        await client.Organization.Team.RemoveMembership(teamId, login);

        return NoContent();
    }
}
