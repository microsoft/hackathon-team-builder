using GreenDonut;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TeamBuilder.API.Data;
using TeamBuilder.Models;

namespace TeamBuilder.API.DataLoader
{
    public class TeamMemberByUserIdDataLoader : GroupedDataLoader<string, TeamMember>
    {
        private readonly IDbContextFactory<TeamBuilderDbContext> _dbContextFactory;

        public TeamMemberByUserIdDataLoader(
            IBatchScheduler batchScheduler,
            IDbContextFactory<TeamBuilderDbContext> dbContextFactory,
            DataLoaderOptions options)
            : base(batchScheduler, options)
        {
            _dbContextFactory = dbContextFactory ??
                throw new ArgumentNullException(nameof(dbContextFactory));
        }

        protected override async Task<ILookup<string, TeamMember>> LoadGroupedBatchAsync(IReadOnlyList<string> keys, CancellationToken cancellationToken)
        {
            await using TeamBuilderDbContext dbContext = _dbContextFactory.CreateDbContext();

            return dbContext.TeamMembers
                .Where(t => keys.Contains(t.UserId))
                .ToLookup(t => t.UserId);
        }
    }
}
