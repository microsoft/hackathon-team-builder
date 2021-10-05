using System.Collections.Generic;
using System.Linq;
using TeamBuilder.API.Data;

namespace TeamBuilder.API
{
    public class Query
    {
        public IQueryable<ChallengeArea> GetChallenges() => new List<ChallengeArea>().AsQueryable();
    }
}
