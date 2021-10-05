using Microsoft.EntityFrameworkCore;

namespace TeamBuilder.API.Data
{
    public class TeamBuilderDbContext : DbContext
    {
        public TeamBuilderDbContext(DbContextOptions<TeamBuilderDbContext> options)
            : base(options)
        {
        }

        public DbSet<ChallengeArea> Challenges { get; set; }
        public DbSet<Team> Teams { get; set; }
    }
}
