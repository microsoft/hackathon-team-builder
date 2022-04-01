﻿using TeamBuilder.API.Common;
using TeamBuilder.API.Data;

namespace TeamBuilder.API.AppSettings
{
    public class AppSettingPayload : AppSettingPayloadBase
    {
        public AppSettingPayload(AppSetting appSetting) : base(appSetting)
        { 
        }

        public AppSettingPayload(UserError error) : base(new[] {error})
        { 
        }

    }
}