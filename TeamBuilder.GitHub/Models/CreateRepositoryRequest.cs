using System.ComponentModel.DataAnnotations;

namespace TeamBuilder.GitHub.Models;

public class CreateRepositoryRequest
{
    [Required]
    public string RepositoryName { get; set; }
    public string Description { get; set; }
    public string Homepage { get; set; }
}
