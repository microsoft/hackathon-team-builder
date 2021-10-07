using TeamBuilder.API.Data;

namespace TeamBuilder.API.Challenges
{
    public class AddChallengePayload
    {
        public AddChallengePayload(ChallengeArea challenge)
        {
            Challenge = challenge;
        }

        public ChallengeArea Challenge { get; }
    }
}