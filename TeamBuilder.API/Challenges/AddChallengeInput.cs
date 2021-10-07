namespace TeamBuilder.API.Challenges
{
    public record AddChallengeInput(
        string Name,
        string Prefix,
        string? Description
    );
}