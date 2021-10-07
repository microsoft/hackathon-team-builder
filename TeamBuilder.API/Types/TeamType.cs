using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using TeamBuilder.API.Data;
using TeamBuilder.API.DataLoader;
using HotChocolate;
using HotChocolate.Types;

namespace TeamBuilder.API.Types
{
    public class TeamType : ObjectType<Team>
    {
        protected override void Configure(IObjectTypeDescriptor<Team> descriptor)
        {
            descriptor
                .Field(t => t.Challenge)
                .ResolveWith<TeamResolvers>(c => c.GetChallengeAreaAsync(default!, default!, default))
                .UseDbContext<TeamBuilderDbContext>()
                .Name("challenge");

            descriptor
                .Field(t => t.TeamMembers)
                .ResolveWith<TeamResolvers>(c => c.GetTeamMembersAsync(default!, default!, default))
                .UseDbContext<TeamBuilderDbContext>()
                .Name("members");

            descriptor
                .Field(t => t.ChallengeAreaId)
                .ID(nameof(ChallengeArea));
        }

        private class TeamResolvers
        {
            public async Task<ChallengeArea> GetChallengeAreaAsync(
                [Parent] Team team,
                ChallengeByIdDataLoader challengeById,
                CancellationToken cancellationToken) =>
                    await challengeById.LoadAsync(team.ChallengeAreaId, cancellationToken);

            public async Task<List<TeamMember>> GetTeamMembersAsync(
                [Parent] Team team,
                TeamMemberByTeamIdDataLoader loader,
                CancellationToken cancellationToken) =>
                (await loader.LoadAsync(team.Id, cancellationToken)).ToList();
        }
    }
}