using Microsoft.AspNetCore.Mvc;
using Octokit;
using TeamBuilder.GitHub.Services;

namespace TeamBuilder.GitHub.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly GitHubClientFactory _factory;

        public TeamsController(GitHubClientFactory factory)
        {
            _factory = factory;
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<Team>), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetTeamsAsync()
        {
            try
            {
                var client = await _factory.GetClientAsync();

                var team = await client.Organization.Team.GetAll(_factory.Org);

                if (team == null)
                    return NotFound();

                return Ok(team);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{teamId}")]
        [ProducesResponseType(typeof(Team), 200)]
        [ProducesResponseType(404)]
        public async Task<IActionResult> GetTeamAsync([FromRoute] int teamId)
        {
            var client = await _factory.GetClientAsync();

            var team = await client.Organization.Team.Get(teamId);

            if (team == null)
                return NotFound();

            return Ok(team);
        }
    }
}
