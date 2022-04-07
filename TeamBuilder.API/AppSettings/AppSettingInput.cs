using TeamBuilder.API.Data;

namespace TeamBuilder.API.AppSettings
{
    public record AppSettingInput(
        string msTeamId,
        AppSettingNames setting,
        string value
    );
}