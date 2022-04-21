using GraphQL;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;
using System.Threading.Tasks;

namespace TeamBuilder.Serverless.Services
{
    public class TeamBuilderApiClient
    {
        private readonly GraphQLHttpClient _client;

        public TeamBuilderApiClient(string url)
        {
            var serializer = new NewtonsoftJsonSerializer();

            _client = new GraphQLHttpClient(url, serializer);
        }

        public async Task<Models.Team> GetTeamAsync(int teamId)
        {
            var request = new GraphQLRequest
            {
                Query = $"team(id: ${teamId}) "+@"{
    name
    description
  }"
            };

            var response = await _client.SendQueryAsync<ResponseType<Models.Team>>(request);

            return response.Data.Value;
        }

        public class ResponseType<T>
        {
            public T Value { get; set; }
        }
    }
}
