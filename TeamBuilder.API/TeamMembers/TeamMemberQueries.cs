using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamBuilder.API.Data;
using TeamBuilder.Models;

namespace TeamBuilder.API.TeamMembers
{
    [ExtendObjectType(OperationTypeNames.Query)]
    public class TeamMemberQueries
    {
        [UseTeamBuilderDbContext]
        public Task<List<TeamMember>> GetMembershipByUserId([ScopedService] TeamBuilderDbContext context, string userId) => 
            context.TeamMembers.Where(t => t.UserId.Equals(userId)).ToListAsync();
    }
}
