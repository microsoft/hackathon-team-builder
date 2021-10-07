namespace TeamBuilder.API.Teams
{
    public record JoinTeamInput(
        int TeamId,
        string UserId,
        bool IsLead);
}
