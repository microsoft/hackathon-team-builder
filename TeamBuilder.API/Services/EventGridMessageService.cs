using Azure.Messaging.EventGrid;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace TeamBuilder.API.Services
{
    public class EventGridMessageService : IMessageService
    {
        private const string DATA_VERSION = "1.0";
        private readonly EventGridPublisherClient _publisherClient;

        public EventGridMessageService(IOptions<EventGridMessageServiceConfiguration> config)
        {
            Uri.TryCreate(config.Value.Endpoint, UriKind.RelativeOrAbsolute, out var uri);

            var accessKey = new Azure.AzureKeyCredential(config.Value.AccessKey);

            _publisherClient = new EventGridPublisherClient(uri, accessKey);
        }

        public async Task SendAsync<T>(T entity, MutationType mutationType)
        {
            var subject = $"{typeof(T).Name} {mutationType.ToString().ToLower()}d";

            var messsage = new EventGridEvent(subject, $"{typeof(T).Name}.{mutationType}", DATA_VERSION, entity);

            await _publisherClient.SendEventAsync(messsage);
        }
    }

    public class EventGridMessageServiceConfiguration
    {
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        public string Endpoint { get; set; }
        public string AccessKey { get; set; }
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
    }
}
