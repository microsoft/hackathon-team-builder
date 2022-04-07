using TeamBuilder.Models;

namespace TeamBuilder.API.Challenges
{
    public class AddChallengePayload : ChallengePayloadBase
    {
        public AddChallengePayload(ChallengeArea challenge) : base(challenge) { }

    }
}