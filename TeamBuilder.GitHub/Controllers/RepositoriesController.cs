using Microsoft.AspNetCore.Mvc;
using Octokit;
using TeamBuilder.GitHub.Models;
using TeamBuilder.GitHub.Services;

namespace TeamBuilder.GitHub.Controllers;

[Route("api/Teams/{teamId}/[controller]")]
[ApiController]
public class RepositoriesController : ControllerBase
{
    private readonly GitHubClientFactory _factory;

    public RepositoriesController(GitHubClientFactory factory)
    {
        _factory = factory;
    }

    [HttpGet]
    [ProducesResponseType(typeof(List<Repository>), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetRepositoriesAsync([FromRoute] int teamId)
    {
        var client = await _factory.GetClientAsync();

        var repos = await client.Organization.Team.GetAllRepositories(teamId);

        if (repos == null)
            return NotFound();

        return Ok(repos);
    }

    [HttpGet("{repositoryId}")]
    [ProducesResponseType(typeof(Repository), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetRepositoryAsync([FromRoute] long repositoryId)
    {
        var client = await _factory.GetClientAsync();

        var repository = await client.Repository.Get(repositoryId);

        if (repository == null)
            return NotFound();

        return Ok(repository);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Repository), 201)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> CreateRepositoryAsync([FromRoute] int teamId, [FromBody] CreateRepositoryRequest request)
    {
        var client = await _factory.GetClientAsync();

        var repos = await client.Organization.Team.GetAllRepositories(teamId);

        if (repos.Any(r => r.Name == request.RepositoryName))
            return new ConflictResult();

        var newRepo = new NewRepository(request.RepositoryName)
        {
            Description = request.Description,
            Homepage = request.Homepage,
            TeamId = teamId
        };

        var repository = await client.Repository.Create(newRepo);

        return CreatedAtAction(nameof(GetRepositoryAsync), new { repositoryId = repository.Id }, repository);
    }

    [HttpPut("{repositoryId}")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> UpdateRepositoryAsync([FromRoute] long repositoryId, [FromBody] UpdateRepositoryRequest request)
    {
        var client = await _factory.GetClientAsync();

        var repository = await client.Repository.Get(repositoryId);

        // should we just override no matter what or only if the request prop is not null?
        var updatedRepository = new RepositoryUpdate(request.RepositoryName ?? repository.Name)
        {
            Description = request.Description,
            Homepage = request.Homepage
        };

        await client.Repository.Edit(repositoryId, updatedRepository);

        return NoContent();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> DeleteRepositoryAsync([FromRoute] long repositoryId)
    {
        var client = await _factory.GetClientAsync();

        await client.Repository.Delete(repositoryId);

        return NoContent();
    }
}
