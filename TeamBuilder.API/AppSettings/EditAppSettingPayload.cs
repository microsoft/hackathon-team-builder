using TeamBuilder.API.Common;
using TeamBuilder.API.Data;

namespace TeamBuilder.API.AppSettings
{
    public class EditAppSettingPayload : AppSettingPayloadBase
    {
        public EditAppSettingPayload(AppSetting appSetting) : base(appSetting) { }

        public EditAppSettingPayload(UserError error) : base(new[] { error }) { }
    }
}