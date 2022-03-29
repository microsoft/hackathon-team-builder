using TeamBuilder.API.Common;
using TeamBuilder.API.Data;

namespace TeamBuilder.API.AppSettings
{
    public class AddAppSettingPayload : AppSettingPayloadBase
    {
        public AddAppSettingPayload(AppSetting appSetting) : base(appSetting)
        { 
        }

        public AddAppSettingPayload(UserError error) : base(new[] {error})
        { 
        }

    }
}