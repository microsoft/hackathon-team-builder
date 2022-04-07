using System.Collections.Generic;
using TeamBuilder.API.Common;
using TeamBuilder.API.Data;

namespace TeamBuilder.API.AppSettings
{
    public class RemoveAppSettingPayload : Payload
    {
        public RemoveAppSettingPayload()
        {
        }

        public RemoveAppSettingPayload(IReadOnlyList<UserError> errors) : base(errors)
        {
        }
    }
}
