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

    [HttpGet("Members")]
    [ProducesResponseType(typeof(List<User>), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetTeamMembersAsync([FromRoute] int teamId)
    {
        var client = await _factory.GetClientAsync();

        var teamMembers = await client.Organization.Team.GetAllMembers(teamId);

        if (teamMembers == null)
            return NotFound();

        return Ok(teamMembers);
    }

    [HttpPost("Members")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> AddTeamMemberAsync([FromRoute] int teamId, [FromBody] string login)
    {
        var client = await _factory.GetClientAsync();

        await client.Organization.Team.AddOrEditMembership(teamId, login, new UpdateTeamMembership(TeamRole.Member));

        return NoContent();
    }

    [HttpDelete("Members/{login}")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> RemoveTeamMemberAsync([FromRoute] int teamId, [FromRoute] string login)
    {
        var client = await _factory.GetClientAsync();

        await client.Organization.Team.RemoveMembership(teamId, login);

        return NoContent();
    }
}
