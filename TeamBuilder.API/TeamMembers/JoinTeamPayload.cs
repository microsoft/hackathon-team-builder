using TeamBuilder.API.Common;
using TeamBuilder.Models;

namespace TeamBuilder.API.TeamMembers
{
    public class JoinTeamPayload : TeamMemberPayloadBase
    {
        public JoinTeamPayload(TeamMember teamMember) : base(teamMember)
        {
        }

        public JoinTeamPayload(UserError error) : base(new[] { error })
        {
        }
    }
}
