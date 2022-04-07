using System.Collections.Generic;
using TeamBuilder.API.Common;
using TeamBuilder.Models;

namespace TeamBuilder.API.TeamMembers
{
    public class TeamMemberPayloadBase : Payload
    {
        protected TeamMemberPayloadBase(TeamMember teamMember)
        {
            TeamMember = teamMember;
        }

        protected TeamMemberPayloadBase(IReadOnlyList<UserError> errors) : base(errors)
        {
        }

        public TeamMember? TeamMember { get; }
    }
}
