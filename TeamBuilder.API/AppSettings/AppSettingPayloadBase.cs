using System.Collections.Generic;
using TeamBuilder.API.Common;
using TeamBuilder.API.Data;

namespace TeamBuilder.API.AppSettings
{
    public class AppSettingPayloadBase : Payload
    {
        protected AppSettingPayloadBase(AppSetting appSetting)
        {
            AppSetting = appSetting;
        }

        protected AppSettingPayloadBase(IReadOnlyList<UserError> errors) : base(errors)
        {
        }

        public AppSetting? AppSetting { get; }
    }
}
