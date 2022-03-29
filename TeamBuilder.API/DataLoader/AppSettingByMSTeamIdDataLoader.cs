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
    public class AppSettingByMSTeamIdDataLoader : BatchDataLoader<string, AppSetting>
    {
        private readonly IDbContextFactory<TeamBuilderDbContext> _dbContextFactory;

        public AppSettingByMSTeamIdDataLoader(
            IBatchScheduler batchScheduler,
            IDbContextFactory<TeamBuilderDbContext> dbContextFactory,
            DataLoaderOptions options)
            : base(batchScheduler, options)
        {
            _dbContextFactory = dbContextFactory ??
                throw new ArgumentNullException(nameof(dbContextFactory));
        }

        protected override async Task<IReadOnlyDictionary<string, AppSetting>> LoadBatchAsync(IReadOnlyList<string> keys, CancellationToken cancellationToken)
        {
            await using TeamBuilderDbContext dbContext = _dbContextFactory.CreateDbContext();

            return await dbContext.AppSettings
                .Where(a => keys.Contains(a.MSTeamId))
                .ToDictionaryAsync(a => a.MSTeamId, cancellationToken);
        }
    }
}