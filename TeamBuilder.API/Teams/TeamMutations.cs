using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using TeamBuilder.API.Common;
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

        [UseTeamBuilderDbContext]
        public async Task<EditTeamPayload> EditTeamAsync(
            EditTeamInput input,
            [ScopedService] TeamBuilderDbContext context)
        {
            var team2Edit = await context.Teams.FindAsync(input.Id);
            if (team2Edit == null)
            {
                return new EditTeamPayload(new UserError("Item to edit was not found.", "404"));
            }

            team2Edit.Description = input.Description;

            context.Entry(team2Edit).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return new EditTeamPayload(team2Edit);
        }

        [UseTeamBuilderDbContext]
        public async Task<RemoveTeamPayload> RemoveTeamAsync(
            RemoveTeamInput input,
            [ScopedService] TeamBuilderDbContext context)
        {
            var team2Delete = await context.Teams.FindAsync(input.teamId);
            if (team2Delete == null)
            {
                return new RemoveTeamPayload(new[] { new UserError("Item to delete was not found.", "404") });
            }

            context.Teams.Remove(team2Delete);
            await context.SaveChangesAsync();

            return new RemoveTeamPayload();
        }
    }
}
