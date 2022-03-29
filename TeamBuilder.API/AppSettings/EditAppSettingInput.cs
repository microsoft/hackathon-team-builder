namespace TeamBuilder.API.AppSettings
{
    public record EditAppSettingInput(
        string MSTeamId,
        string Setting,
        string Value
        );
}
