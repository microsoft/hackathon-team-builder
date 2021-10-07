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
    public class ChallengeByIdDataLoader : BatchDataLoader<int, ChallengeArea>
    {
        private readonly IDbContextFactory<TeamBuilderDbContext> _dbContextFactory;

        public ChallengeByIdDataLoader(
            IBatchScheduler batchScheduler,
            IDbContextFactory<TeamBuilderDbContext> dbContextFactory,
            DataLoaderOptions options)
            : base(batchScheduler, options)
        {
            _dbContextFactory = dbContextFactory ??
                throw new ArgumentNullException(nameof(dbContextFactory));
        }

        protected override async Task<IReadOnlyDictionary<int, ChallengeArea>> LoadBatchAsync(IReadOnlyList<int> keys, CancellationToken cancellationToken)
        {
            await using TeamBuilderDbContext dbContext = _dbContextFactory.CreateDbContext();

            return await dbContext.Challenges
                .Where(c => keys.Contains(c.Id))
                .ToDictionaryAsync(c => c.Id, cancellationToken);
        }
    }
}
