using Microsoft.AspNetCore.Mvc;
using Octokit;
using TeamBuilder.GitHub.Services;

namespace TeamBuilder.GitHub.Controllers;

[ApiController]
[Route("[controller]")]
public class TeamMembersController : ControllerBase
{
    private readonly GitHubClientFactory _factory;

    public TeamMembersController(GitHubClientFactory factory)
    {
        _factory = factory;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<Team>), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetTeamAsync(int teamId)
    {
        var client = await _factory.GetClientAsync();

        var team = await client.Organization.Team.Get(teamId);

        if (team == null)
            return NotFound();

        return Ok(team);
    }

    [HttpGet("members")]
    [ProducesResponseType(typeof(List<User>), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetTeamMembersAsync()
    {
        var client = await _factory.GetClientAsync();

        var teamMembers = await client.Organization.Team.GetAllMembers(_factory.TeamId);

        if (teamMembers == null)
            return NotFound();

        return Ok(teamMembers);
    }

    [HttpPost("members")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> AddTeamMemberAsync([FromBody] string login)
    {
        var client = await _factory.GetClientAsync();

        await client.Organization.Team.AddOrEditMembership(_factory.TeamId, login, new UpdateTeamMembership(TeamRole.Member));

        return NoContent();
    }

    [HttpDelete("members/{login}")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> RemoveTeamMemberAsync([FromRoute] string login)
    {
        var client = await _factory.GetClientAsync();

        await client.Organization.Team.RemoveMembership(_factory.TeamId, login);

        return NoContent();
    }
}
