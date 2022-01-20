namespace TeamBuilder.API.Challenges
{
    public record EditChallengeInput(
        string? Name,
        string? Prefix,
        string? Description
    );
}
