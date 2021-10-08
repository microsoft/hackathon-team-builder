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
                .Field(t => t.User)
                .ResolveWith<TeamMemberResolvers>(c => c.GetMemberAsync(default!, default!, default))
                .Name("user");
        }

        private class TeamMemberResolvers
        {
            public async Task<Member> GetMemberAsync(
                [Parent] TeamMember tm,
                UserByIdDataLoader loader,
                CancellationToken cancellationToken) => await loader.LoadAsync(tm.UserId, cancellationToken);
        }
    }
}
