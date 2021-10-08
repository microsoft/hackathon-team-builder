using HotChocolate;
using HotChocolate.Types;
using System.Threading.Tasks;
using TeamBuilder.API.Data;

namespace TeamBuilder.API.Challenges
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ChallengeMutations
    {
        [UseTeamBuilderDbContext]
        public async Task<AddChallengePayload> AddChallengeAsync(
            AddChallengeInput input,
            [ScopedService] TeamBuilderDbContext context)
        {
            var challenge = new ChallengeArea
            {
                Name = input.Name,
                Prefix = input.Prefix,
                Description = input.Description
            };

            context.Challenges.Add(challenge);
            await context.SaveChangesAsync();

            return new AddChallengePayload(challenge);
        }
    }
}
