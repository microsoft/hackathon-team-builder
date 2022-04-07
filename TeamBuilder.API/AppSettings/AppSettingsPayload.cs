using System.Collections.Generic;
using TeamBuilder.API.Common;
using TeamBuilder.Models;

namespace TeamBuilder.API.AppSettings
{
    public class AppSettingsPayload : Payload
    {
        public IList<AppSetting>? AppSettings { get; }

        public AppSettingsPayload(IList<AppSetting> appSettings)
        {
            AppSettings = appSettings;
        }

        public AppSettingsPayload(UserError error) : base(new[] { error })
        {
        }
    }
}