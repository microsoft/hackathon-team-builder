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
    public class TeamByIdDataLoader: BatchDataLoader<int, Team>
    {
        private readonly IDbContextFactory<TeamBuilderDbContext> _dbContextFactory;

        public TeamByIdDataLoader(
            IBatchScheduler batchScheduler,
            IDbContextFactory<TeamBuilderDbContext> dbContextFactory,
            DataLoaderOptions options)
            : base(batchScheduler, options)
        {
            _dbContextFactory = dbContextFactory ?? 
                throw new ArgumentNullException(nameof(dbContextFactory));
        }

        protected override async Task<IReadOnlyDictionary<int, Team>> LoadBatchAsync(IReadOnlyList<int> keys, CancellationToken cancellationToken)
        {
            await using TeamBuilderDbContext dbContext = _dbContextFactory.CreateDbContext();

            return await dbContext.Teams
                .Where(t => keys.Contains(t.Id))
                .ToDictionaryAsync(t => t.Id, cancellationToken);
        }
    }
}