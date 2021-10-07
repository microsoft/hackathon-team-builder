using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TeamBuilder.API.Data;
using TeamBuilder.API.DataLoader;
using HotChocolate;
using HotChocolate.Resolvers;
using HotChocolate.Types;

namespace TeamBuilder.API.Types
{
    public class ChallengeType : ObjectType<ChallengeArea>
    {
        protected override void Configure(IObjectTypeDescriptor<ChallengeArea> descriptor)
        {
            descriptor
                .Field(t => t.Teams)
                .ResolveWith<ChallengeResolvers>(t => t.GetTeamsAsync(default!, default!, default!, default))
                .UseDbContext<TeamBuilderDbContext>()
                .Name("teams");
        }

        private class ChallengeResolvers
        {
            public async Task<IEnumerable<Team>> GetTeamsAsync(
                [Parent] ChallengeArea challenge,
                [ScopedService] TeamBuilderDbContext dbContext,
                TeamByIdDataLoader teamById,
                CancellationToken cancellationToken
            )
            {
                int[] teamIds = await dbContext.Challenges
                    .Where(c => c.Id == challenge.Id)
                    .Include(c => c.Teams)
                    .SelectMany(c => c.Teams.Select(t => t.ChallengeAreaId))
                    .ToArrayAsync();

                return await teamById.LoadAsync(teamIds, cancellationToken);    
            }
        }
    }
}