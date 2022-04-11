using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using TeamBuilder.API.Data;
using TeamBuilder.API.Services;

namespace TeamBuilder.API.TeamMembers
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class TeamMemberMutations
    {
        [UseTeamBuilderDbContext]
        public async Task<JoinTeamPayload> JoinTeamAsync(
            JoinTeamInput input,
            [ScopedService] TeamBuilderDbContext context,
            [Service] IMessageService messageService)
        {
            var teamMember = new TeamMember
            {
                TeamId = input.TeamId,
                UserId = input.UserId,
                IsLead = input.IsLead
            };

            context.TeamMembers.Add(teamMember);
            await context.SaveChangesAsync();

            await messageService.SendAsync(teamMember, MutationType.Create);

            return new JoinTeamPayload(teamMember);
        }

        [UseTeamBuilderDbContext]
        public async Task<bool> LeaveTeamAsync(
            LeaveTeamInput input,
            [ScopedService] TeamBuilderDbContext context,
            [Service] IMessageService messageService)
        {
            var itemToRemove = context.TeamMembers
                .Where(t => t.TeamId == input.TeamId && t.UserId == input.UserId)
                .FirstOrDefault();

            context.Remove(itemToRemove);
            await context.SaveChangesAsync();

            await messageService.SendAsync(itemToRemove, MutationType.Delete);

            return true;
        }

        [UseTeamBuilderDbContext]
        public async Task<JoinTeamPayload> LeadTeamAsync(
            JoinTeamInput input,
            [ScopedService] TeamBuilderDbContext context,
            [Service] IMessageService messageService)
        {
            var itemToUpdate = context.TeamMembers
                .Where(t => t.TeamId == input.TeamId && t.UserId == input.UserId)
                .FirstOrDefault();

            if (itemToUpdate == null)
            {
                return await JoinTeamAsync(input, context, messageService);
            }

            itemToUpdate.IsLead = input.IsLead;
            
            await context.SaveChangesAsync();

            await messageService.SendAsync(itemToUpdate, MutationType.Update);

            return new JoinTeamPayload(itemToUpdate);
        }

    }
}
