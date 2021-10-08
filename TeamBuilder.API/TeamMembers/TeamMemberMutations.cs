using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using TeamBuilder.API.Common;
using TeamBuilder.API.Data;

namespace TeamBuilder.API.TeamMembers
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class TeamMemberMutations
    {
        [UseTeamBuilderDbContext]
        public async Task<JoinTeamPayload> JoinTeamAsync(
            JoinTeamInput input,
            [ScopedService] TeamBuilderDbContext context)
        {
            var teamMember = new TeamMember
            {
                TeamId = input.TeamId,
                UserId = input.UserId,
                IsLead = input.IsLead
            };

            context.TeamMembers.Add(teamMember);
            await context.SaveChangesAsync();

            return new JoinTeamPayload(teamMember);
        }

        [UseTeamBuilderDbContext]
        public async Task<bool> LeaveTeamAsync(
            LeaveTeamInput input,
            [ScopedService] TeamBuilderDbContext context)
        {
            var itemToRemove = context.TeamMembers
                .Where(t => t.TeamId == input.TeamId && t.UserId == input.UserId)
                .FirstOrDefault();

            context.Remove(itemToRemove);
            await context.SaveChangesAsync();

            return true;
        }

        [UseTeamBuilderDbContext]
        public async Task<JoinTeamPayload> LeadTeamAsync(
            JoinTeamInput input,
            [ScopedService] TeamBuilderDbContext context)
        {
            var itemToUpdate = context.TeamMembers
                .Where(t => t.TeamId == input.TeamId && t.UserId == input.UserId)
                .FirstOrDefault();            

            if (itemToUpdate == null)
            {
                return await JoinTeamAsync(input, context);
            }

            itemToUpdate.IsLead = input.IsLead;
            context.Entry(itemToUpdate).State = EntityState.Modified;
            await context.SaveChangesAsync();

            return new JoinTeamPayload(itemToUpdate);
        }

    }
}
