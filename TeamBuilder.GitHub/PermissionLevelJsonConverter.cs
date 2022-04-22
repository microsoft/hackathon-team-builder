using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Newtonsoft.Json;
using Octokit;

namespace TeamBuilder.GitHub;

public class PermissionLevelJsonConverter : JsonConverter<StringEnum<PermissionLevel>>
{
    public override StringEnum<PermissionLevel> ReadJson(JsonReader reader, Type objectType, StringEnum<PermissionLevel> existingValue, bool hasExistingValue, JsonSerializer serializer)
    {
        PermissionLevel parsedValue;
        StringEnum<PermissionLevel> result;
        var value = reader.Value as string;
        if (Enum.TryParse(value, out parsedValue))
        {
            result = new StringEnum<PermissionLevel>(parsedValue);
        }
        else
        {
            result = new StringEnum<PermissionLevel>(value);
        }
        return result;
    }

    public override void WriteJson(JsonWriter writer, StringEnum<PermissionLevel> value, JsonSerializer serializer)
    {
        writer.WriteValue(value.StringValue);
    }
}
