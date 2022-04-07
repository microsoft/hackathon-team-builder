using TeamBuilder.Models;

namespace TeamBuilder.API.Challenges
{
    public class EditChallengePayload : ChallengePayloadBase
    {
        public EditChallengePayload(ChallengeArea challenge) : base(challenge) { }
        public EditChallengePayload(bool succeeded, string reason) : base(succeeded, reason) { }
    }
}
