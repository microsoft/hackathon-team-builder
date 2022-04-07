using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TeamBuilder.API.Data;
using TeamBuilder.API.DataLoader;

namespace TeamBuilder.API.AppSettings
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class AppSettingQueries
    {
        [UseTeamBuilderDbContext]
        public Task<List<AppSetting>> GetAppSettings([ScopedService] TeamBuilderDbContext context) => context.AppSettings.ToListAsync();

        public Task<AppSetting> GetAppSettingsAsync(
            string msTeamId,
            AppSettingByMSTeamIdDataLoader dataLoader,
            CancellationToken cancellationToken
        ) => dataLoader.LoadAsync(msTeamId, cancellationToken);

        [UseTeamBuilderDbContext]
        public Task<List<AppSetting>> GetAppSettingsByMSTeamId([ScopedService] TeamBuilderDbContext context, string msTeamId) =>
            context.AppSettings.Where(a => a.MSTeamId.Equals(msTeamId)).ToListAsync();

    }
}

