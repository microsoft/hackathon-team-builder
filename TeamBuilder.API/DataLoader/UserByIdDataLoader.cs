using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Graph;
using GreenDonut;
using TeamBuilder.API.Data;

namespace TeamBuilder.API.DataLoader
{

    public class UserByIdDataLoader : BatchDataLoader<string, Member>
    {
        private readonly GraphServiceClient _graphClient;
        public UserByIdDataLoader(
            IBatchScheduler batchScheduler,
            GraphServiceClient graphClient,
            DataLoaderOptions options
            ) : base(batchScheduler, options)
        {
            _graphClient = graphClient;
        }

        protected override async Task<IReadOnlyDictionary<string, Member>> LoadBatchAsync(IReadOnlyList<string> keys, CancellationToken cancellationToken)
        {
            var result = new Dictionary<string, Member>();
            var batchReq = new BatchRequestContent();
            var reqIds = new Dictionary<string, string>(); // userid, requestid

            foreach (var i in keys) {
                reqIds.Add(i, batchReq.AddBatchRequestStep(_graphClient.Users[i].Request()));
            }

            var resp = await _graphClient.Batch.Request().PostAsync(batchReq);

            foreach (var req in reqIds)
            {
                var user = await resp.GetResponseByIdAsync<User>(req.Value);
                var member = new Member
                {
                    UserId = user.UserPrincipalName,
                    FirstName = user.GivenName,
                    LastName = user.Surname,
                    FullName = user.DisplayName
                };
                result.Add(req.Key, member);
            }

            return result;
        }

    }
}
