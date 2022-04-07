using System.Collections.Generic;
using TeamBuilder.API.Common;
using TeamBuilder.Models;

namespace TeamBuilder.API.Teams
{
    public class TeamPayloadBase : Payload
    {
        protected TeamPayloadBase(Team team)
        { 
            Team = team;
        }

        protected TeamPayloadBase(IReadOnlyList<UserError> errors) : base(errors)
        {
        }

        public Team? Team { get; }
    }
}
