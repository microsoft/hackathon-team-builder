using TeamBuilder.API.Data;

namespace TeamBuilder.API.AppSettings
{
    public record AppSettingInput(
        string msTeamId,
        string setting,
        string value
    );
}