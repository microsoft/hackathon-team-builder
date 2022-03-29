namespace TeamBuilder.API.AppSettings
{
    public record AddAppSettingInput(
        string MSTeamId,
        string Setting,
        string Value
    );
}