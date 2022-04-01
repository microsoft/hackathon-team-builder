namespace TeamBuilder.API.AppSettings
{
    public record AppSettingInput(
        string MSTeamId,
        string Setting,
        string Value
    );
}