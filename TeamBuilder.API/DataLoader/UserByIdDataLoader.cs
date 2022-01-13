using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Graph;
using GreenDonut;
using TeamBuilder.API.Data;
using Microsoft.Extensions.Logging;
using System;

namespace TeamBuilder.API.DataLoader
{

    public class UserByIdDataLoader : BatchDataLoader<string, Member>
    {
        private readonly GraphServiceClient _graphClient;
        private readonly ILogger _logger;

        public UserByIdDataLoader(
            IBatchScheduler batchScheduler,
            GraphServiceClient graphClient,
            DataLoaderOptions options,
            ILogger<UserByIdDataLoader> logger
            ) : base(batchScheduler, options)
        {
            _graphClient = graphClient;
            _logger = logger;
        }

        protected override async Task<IReadOnlyDictionary<string, Member>> LoadBatchAsync(IReadOnlyList<string> keys, CancellationToken cancellationToken)
        {
            var result = new Dictionary<string, Member>();

            try
            {
                _logger.LogInformation("Fetching user information from GraphAPI");
                var batchReq = new BatchRequestContent();
                var reqIds = new Dictionary<string, string>(); // userid, requestid

                foreach (var i in keys)
                {
                    reqIds.Add(i, batchReq.AddBatchRequestStep(_graphClient.Users[i].Request()));
                }

                var resp = await _graphClient.Batch.Request().PostAsync(batchReq);

                foreach (var req in reqIds)
                {
                    var user = await resp.GetResponseByIdAsync<User>(req.Value);
                    var member = new Member
                    {
                        UserId = user.Id,
                        UserEmail = user.Mail,
                        FirstName = user.GivenName,
                        LastName = user.Surname,
                        FullName = user.DisplayName
                    };
                    result.Add(req.Key, member);
                }

                _logger.LogInformation("Response from graphclient success");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                throw ex;
            }
        }

    }
}
