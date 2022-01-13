namespace TeamBuilder.API.Data
{
    public class TeamMember
    {
        public int TeamId { get; set; }
        public Team? Team { get; set; }
        public string UserId { get; set; } = default!;
        public bool IsLead { get; set; }
    }
}