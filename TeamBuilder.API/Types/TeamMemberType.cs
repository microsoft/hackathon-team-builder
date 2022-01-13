using HotChocolate;
using HotChocolate.Types;
using System.Threading;
using System.Threading.Tasks;
using TeamBuilder.API.Data;
using TeamBuilder.API.DataLoader;

namespace TeamBuilder.API.Types
{
    public class TeamMemberType : ObjectType<TeamMember>
    {
        protected override void Configure(IObjectTypeDescriptor<TeamMember> descriptor)
        {
            descriptor
                .Field("user")
                .ResolveWith<TeamMemberResolvers>(c => c.GetMemberAsync(default!, default!, default));

            descriptor
                .Field(t => t.Team)
                .ResolveWith<TeamMemberResolvers>(c => c.GetTeamAsync(default!, default!, default))
                .Name("team");
        }

        private class TeamMemberResolvers
        {
            public async Task<Member> GetMemberAsync(
                [Parent] TeamMember tm,
                UserByIdDataLoader loader,
                CancellationToken cancellationToken) => await loader.LoadAsync(tm.UserId, cancellationToken);

            public async Task<Team> GetTeamAsync(
                [Parent] TeamMember tm,
                TeamByIdDataLoader loader,
                CancellationToken cancellationToken) => await loader.LoadAsync(tm.TeamId, cancellationToken);
        }
    }
}
