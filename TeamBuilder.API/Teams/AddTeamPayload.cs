using TeamBuilder.API.Common;
using TeamBuilder.Models;

namespace TeamBuilder.API.Teams
{
    public class AddTeamPayload : TeamPayloadBase
    {
        public AddTeamPayload(Team team) : base(team)
        {
        }

        public AddTeamPayload(UserError error) : base(new[] { error })
        {
        }
    }
}