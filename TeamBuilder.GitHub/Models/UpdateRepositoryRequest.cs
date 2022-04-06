namespace TeamBuilder.GitHub.Models;

public class UpdateRepositoryRequest
{
    public string RepositoryName { get; set; }
    public string Description { get; set; }
    public string Homepage { get; set; }
}
