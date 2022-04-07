using TeamBuilder.API.Data;

namespace TeamBuilder.API.AppSettings
{
    public record RemoveAppSettingInput(
        string msTeamId,
        string setting);
}
