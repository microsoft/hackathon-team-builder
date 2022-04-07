using HotChocolate;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TeamBuilder.API.Data;
using TeamBuilder.API.DataLoader;
using TeamBuilder.Models;

namespace TeamBuilder.API
{
    public class Query
    {
        [UseTeamBuilderDbContext]
        public Task<List<ChallengeArea>> GetChallenges([ScopedService] TeamBuilderDbContext context) => context.Challenges.ToListAsync();

        [UseTeamBuilderDbContext]
        public Task<List<Team>> GetTeams([ScopedService] TeamBuilderDbContext context) => context.Teams.ToListAsync();

        public Task<Team> GetTeamAsync(
            int id,
            TeamByIdDataLoader dataLoader,
            CancellationToken cancellationToken
        ) => dataLoader.LoadAsync(id, cancellationToken);

        public Task<Member> GetUserAsync(
            string userId,
            UserByIdDataLoader dataLoader,
            CancellationToken cancellationToken) => dataLoader.LoadAsync(userId, cancellationToken);
    }
}
