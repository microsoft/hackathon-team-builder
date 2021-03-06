using Microsoft.EntityFrameworkCore;
using TeamBuilder.Models;

namespace TeamBuilder.API.Data
{
    public class TeamBuilderDbContext : DbContext
    {
        public TeamBuilderDbContext(DbContextOptions<TeamBuilderDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TeamMember>().HasKey(t => new { t.TeamId, t.UserId });
            modelBuilder.Entity<AppSetting>().HasKey(a => new { a.MSTeamId, a.Setting });
        }

        public DbSet<ChallengeArea> Challenges { get; set; } = default!;
        public DbSet<Team> Teams { get; set; } = default!;
        public DbSet<TeamMember> TeamMembers { get; set; } = default!;
        public DbSet<AppSetting> AppSettings { get; set; } = default!;
    }
}
