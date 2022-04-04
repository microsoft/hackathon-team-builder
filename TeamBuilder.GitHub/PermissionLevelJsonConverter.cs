using Newtonsoft.Json;
using Octokit;
using System;

namespace TeamBuilder.GitHub
{
    public class PermissionLevelJsonConverter : JsonConverter<StringEnum<PermissionLevel>>
    {
        public override StringEnum<PermissionLevel> ReadJson(JsonReader reader, Type objectType, StringEnum<PermissionLevel> existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override void WriteJson(JsonWriter writer, StringEnum<PermissionLevel> value, JsonSerializer serializer)
        {
            writer.WriteValue(value.StringValue);
        }
    }
}
