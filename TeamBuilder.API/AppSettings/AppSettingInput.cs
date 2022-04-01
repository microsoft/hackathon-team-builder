using TeamBuilder.API.Data;

namespace TeamBuilder.API.AppSettings
{
    public record AppSettingInput(
        string MSTeamId,
        AppSettingNames Setting,
        string Value
    );
}