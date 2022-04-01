using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using TeamBuilder.API.Data;
using TeamBuilder.API.DataLoader;
using HotChocolate;
using System.Threading.Tasks;
using System.Threading;

namespace TeamBuilder.API
{
    public class Query
    {
        [UseTeamBuilderDbContext]
        public Task<List<ChallengeArea>> GetChallenges([ScopedService] TeamBuilderDbContext context) => context.Challenges.ToListAsync();

        [UseTeamBuilderDbContext]
        public Task<List<Team>> GetTeams([ScopedService] TeamBuilderDbContext context) => context.Teams.ToListAsync();

        [UseTeamBuilderDbContext]
        public Task<List<AppSetting>> GetAppSettings([ScopedService] TeamBuilderDbContext context) => context.AppSettings.ToListAsync();

        public Task<Team> GetTeamAsync(
            int id,
            TeamByIdDataLoader dataLoader,
            CancellationToken cancellationToken
        ) => dataLoader.LoadAsync(id, cancellationToken);

        public Task<AppSetting> GetAppSettingsAsync(
            string msTeamId,
            AppSettingByMSTeamIdDataLoader dataLoader,
            CancellationToken cancellationToken
        ) => dataLoader.LoadAsync(msTeamId, cancellationToken);

        public Task<Member> GetUserAsync(
            string userId,
            UserByIdDataLoader dataLoader,
            CancellationToken cancellationToken) => dataLoader.LoadAsync(userId, cancellationToken);
    }
}
