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

    /// <summary>
    /// Get all repositories 
    /// </summary>
    /// <param name="teamId"></param>
    /// <remarks>Get all repositories belonging to a team as denoted by the teamId</remarks>
    /// <returns></returns>
    [HttpGet(Name = nameof(GetRepositoriesAsync))]
    [ProducesResponseType(typeof(List<Repository>), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<List<Repository>>> GetRepositoriesAsync([FromRoute] int teamId)
    {
        var client = await _factory.GetClientAsync();

        var repos = await client.Organization.Team.GetAllRepositories(teamId);

        if (repos == null)
            return NotFound();

        return Ok(repos);
    }

    /// <summary>
    /// Get a repository
    /// </summary>
    /// <param name="repositoryId"></param>
    /// <remarks>Gets a repository as denoted by repositoryId. In theory, the teamId provided should be the team to which the repository belongs but currently there is no validation against that route parameter.</remarks>
    /// <returns></returns>
    [HttpGet("{repositoryId}", Name = nameof(GetRepositoryAsync))]
    [ProducesResponseType(typeof(Repository), 200)]
    [ProducesResponseType(404)]
    public async Task<ActionResult<Repository>> GetRepositoryAsync([FromRoute] long repositoryId)
    {
        var client = await _factory.GetClientAsync();

        var repository = await client.Repository.Get(repositoryId);

        if (repository == null)
            return NotFound();

        return Ok(repository);
    }

    /// <summary>
    /// Create a repository
    /// </summary>
    /// <param name="teamId"></param>
    /// <param name="request"></param>
    /// <remarks>Creates a new GitHub repository for a GitHub team</remarks>
    /// <returns></returns>
    [HttpPost(Name = nameof(CreateRepositoryAsync))]
    [ProducesResponseType(typeof(Repository), 201)]
    [ProducesResponseType(409)]
    public async Task<ActionResult<Repository>> CreateRepositoryAsync([FromRoute] int teamId, [FromBody] CreateRepositoryRequest request)
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

        var repository = await client.Repository.Create(_factory.Org, newRepo);

        return CreatedAtAction(nameof(GetRepositoryAsync), new { repositoryId = repository.Id }, repository);
    }

    /// <summary>
    /// Update a repository
    /// </summary>
    /// <param name="repositoryId"></param>
    /// <param name="request"></param>
    /// Updates an existing GitHub repository based on provided values. Always overrides - even if the values provided are null.
    /// <returns></returns>
    [HttpPut("{repositoryId}", Name = nameof(UpdateRepositoryAsync))]
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

    /// <summary>
    /// Delete a repository
    /// </summary>
    /// <param name="repositoryId"></param>
    /// <remarks>Deletes an existig GitHub repository based on the repositoryId.</remarks>
    /// <returns></returns>
    [HttpDelete("{id}", Name = nameof(DeleteRepositoryAsync))]
    [ProducesResponseType(204)]
    public async Task<IActionResult> DeleteRepositoryAsync([FromRoute] long repositoryId)
    {
        var client = await _factory.GetClientAsync();

        await client.Repository.Delete(repositoryId);

        return NoContent();
    }
}
