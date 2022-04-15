using GreenDonut;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using TeamBuilder.Models;

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
                var batchReq = new BatchRequestContent();
                var reqIds = new List<GraphBatchRequest>(); // userid, requestid

                foreach (var i in keys)
                {
                    var reqItem = new GraphBatchRequest();
                    reqItem.UserId = i;
                    reqItem.UserRequestId = batchReq.AddBatchRequestStep(_graphClient.Users[i].Request());
                    reqItem.PhotoRequestId = batchReq.AddBatchRequestStep(_graphClient.Users[i].Photo.Content.Request());
                    reqItem.PresenceRequestId = batchReq.AddBatchRequestStep(_graphClient.Users[i].Presence.Request());
                    reqIds.Add(reqItem);
                }

                var resp = await _graphClient.Batch.Request().PostAsync(batchReq);

                foreach (var req in reqIds)
                {
                    var user = await resp.GetResponseByIdAsync<User>(req.UserRequestId);

                    var member = new Member
                    {
                        UserId = user.Id,
                        UserEmail = user.Mail,
                        FirstName = user.GivenName,
                        LastName = user.Surname,
                        FullName = user.DisplayName
                    };
                    result.Add(req.UserId, member);
                }

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                throw ex;
            }
        }

        private string GetUserPhoto(Stream photo)
        {
            if (photo != null)
            {
                MemoryStream ms = new MemoryStream();
                photo.CopyTo(ms);
                byte[] buffer = ms.ToArray();
                string result = Convert.ToBase64String(buffer);
                string imgDataURL = string.Format("data:image/png;base64,{0}", result);
                return imgDataURL;
            }
            else
            {
                return string.Empty;
            }
        }

        private class GraphBatchRequest
        {
            public string UserId { get; set; } = default!;
            public string UserRequestId { get; set; } = default!;
            public string PhotoRequestId { get; set; } = default!;
            public string PresenceRequestId { get; set; } = default!;
        }

    }
}
