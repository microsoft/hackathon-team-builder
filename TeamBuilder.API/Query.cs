using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using TeamBuilder.API.Data;
using TeamBuilder.API.DataLoader;
using TeamBuilder.Models;

namespace TeamBuilder.API
{
    [Authorize]
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

        public IDictionary<string, string> GetMe(ClaimsPrincipal claimsPrincipal)
        {
            var results = new Dictionary<string, string>();
            foreach (var claim in claimsPrincipal.Claims)
            {
                results.Add(claim.Type, claim.Value);
            }
            return results;
        }
    }
}
