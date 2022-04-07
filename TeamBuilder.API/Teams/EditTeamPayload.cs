using TeamBuilder.API.Common;
using TeamBuilder.Models;

namespace TeamBuilder.API.Teams
{
    public class EditTeamPayload : TeamPayloadBase
    {
        public EditTeamPayload(Team team) : base(team) { }

        public EditTeamPayload(UserError error) : base(new[] { error }) { }
    }
}
