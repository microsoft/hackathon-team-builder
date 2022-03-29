using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamBuilder.API.Data;

namespace TeamBuilder.API.AppSettings
{
    public class AppSettingQueries
    {
        [UseTeamBuilderDbContext]
        public Task<List<AppSetting>> GetAppSettingsByMSTeamId([ScopedService] TeamBuilderDbContext context, string msTeamId) =>
            context.AppSettings.Where(a => a.MSTeamId.Equals(msTeamId)).ToListAsync();

    }
}

