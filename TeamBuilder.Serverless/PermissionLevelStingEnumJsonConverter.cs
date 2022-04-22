using Newtonsoft.Json;
using System;
using TeamBuilder.Serverless.Services;

namespace TeamBuilder.Serverless
{
    public class PermissionLevelStingEnumJsonConverter : JsonConverter<PermissionLevelStringEnum>
    {
        public override PermissionLevelStringEnum ReadJson(JsonReader reader, Type objectType, PermissionLevelStringEnum existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            PermissionLevel parsedValue;
            PermissionLevelStringEnum result;
            var value = reader.Value as string;
            if (Enum.TryParse(value, out parsedValue))
            {
                result = new PermissionLevelStringEnum { Value = parsedValue };
            }
            else
            {
                result = new PermissionLevelStringEnum { StringValue = value };
            }
            return result;
        }

        public override void WriteJson(JsonWriter writer, PermissionLevelStringEnum value, JsonSerializer serializer)
        {
            throw new NotImplementedException();
        }
    }
}
