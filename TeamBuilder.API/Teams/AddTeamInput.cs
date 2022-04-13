namespace TeamBuilder.API.Teams
{
    public record AddTeamInput(
        string Name,
        string? Description,
        int ChallengeAreaId,
        string? ChannelId
    );
}