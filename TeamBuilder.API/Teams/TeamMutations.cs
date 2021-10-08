using HotChocolate;
using HotChocolate.Types;
using System.Threading.Tasks;
using TeamBuilder.API.Data;

namespace TeamBuilder.API.Teams
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class TeamMutations
    {
        [UseTeamBuilderDbContext]
        public async Task<AddTeamPayload> AddTeamAsync(
            AddTeamInput input,
            [ScopedService] TeamBuilderDbContext context)
        {
            var team = new Team
            {
                Name = input.Name,
                Description = input.Description,
                ChallengeAreaId = input.ChallengeAreaId
            };

            context.Teams.Add(team);
            await context.SaveChangesAsync();

            return new AddTeamPayload(team);
        }
    }
}
