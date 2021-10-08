namespace TeamBuilder.API.TeamMembers
{
    public record JoinTeamInput(
        int TeamId,
        string UserId,
        bool IsLead);

    public record LeaveTeamInput(
        int TeamId,
        string UserId);

    public record LeadTeamInput(
        int TeamId,
        string UserId,
        bool isLead);
}
