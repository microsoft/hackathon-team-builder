using System.Collections.Generic;
using TeamBuilder.API.Common;
using TeamBuilder.API.Data;

namespace TeamBuilder.API.Teams
{
    public class TeamPayloadBase : Payload
    {
        protected TeamPayloadBase(Team team)
        { 
        }

        protected TeamPayloadBase(IReadOnlyList<UserError> errors) : base(errors)
        {
        }

        public Team? Team { get; }
    }
}
