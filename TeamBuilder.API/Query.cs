using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using TeamBuilder.API.Data;
using TeamBuilder.API.DataLoader;
using HotChocolate;
using System.Threading.Tasks;
using System.Threading;
using User=Microsoft.Graph.User;

namespace TeamBuilder.API
{
    public class Query
    {
        [UseTeamBuilderDbContext]
        public Task<List<ChallengeArea>> GetChallenges([ScopedService] TeamBuilderDbContext context) => context.Challenges.ToListAsync();

        public Task<Team> GetTeamAsync(
            int id,
            TeamByIdDataLoader dataLoader,
            CancellationToken cancellationToken
        ) => dataLoader.LoadAsync(id, cancellationToken);

        public Task<Member> GetUserAsync(
            string email,
            UserByIdDataLoader dataLoader,
            CancellationToken cancellationToken) => dataLoader.LoadAsync(email, cancellationToken);
    }
}
