using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TeamBuilder.API.Data;
using GreenDonut;

namespace TeamBuilder.API.DataLoader
{
    public class TeamMemberByTeamIdDataLoader : GroupedDataLoader<int, TeamMember>
    {
        private readonly IDbContextFactory<TeamBuilderDbContext> _dbContextFactory;

        public TeamMemberByTeamIdDataLoader(
            IBatchScheduler batchScheduler,
            IDbContextFactory<TeamBuilderDbContext> dbContextFactory,
            DataLoaderOptions options)
            : base(batchScheduler, options)
        {
            _dbContextFactory = dbContextFactory ??
                throw new ArgumentNullException(nameof(dbContextFactory));
        }

        protected override async Task<ILookup<int, TeamMember>> LoadGroupedBatchAsync(IReadOnlyList<int> keys, CancellationToken cancellationToken)
        {
            await using TeamBuilderDbContext dbContext = _dbContextFactory.CreateDbContext();

            return dbContext.TeamMembers
                .Where(t => keys.Contains(t.TeamId))
                .ToLookup(t => t.TeamId);
        }
    }
}
