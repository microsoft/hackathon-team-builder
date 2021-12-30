using System.Collections.Generic;
using TeamBuilder.API.Common;
using TeamBuilder.API.Data;

namespace TeamBuilder.API.Teams
{
    public class RemoveTeamPayload : Payload
    {
        public RemoveTeamPayload()
        {
        }

        public RemoveTeamPayload(IReadOnlyList<UserError> errors) : base(errors)
        {
        }
    }
}
