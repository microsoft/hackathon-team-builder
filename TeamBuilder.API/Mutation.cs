using System.Threading.Tasks;
using TeamBuilder.API.Data;
using TeamBuilder.API.Challenges;
using TeamBuilder.API.Teams;
using HotChocolate;
using TeamBuilder.API.TeamMembers;

namespace TeamBuilder.API
{
    public class Mutation
    {
        [UseTeamBuilderDbContext]
        public async Task<AddChallengePayload> AddChallengeAsync(
            AddChallengeInput input,
            [ScopedService] TeamBuilderDbContext context)
        {
            var challenge = new ChallengeArea
            {
                Name = input.Name,
                Prefix = input.Prefix,
                Description = input.Description
            };

            context.Challenges.Add(challenge);
            await context.SaveChangesAsync();

            return new AddChallengePayload(challenge);
        }

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
    }
}