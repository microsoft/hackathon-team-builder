using TeamBuilder.Models;

namespace TeamBuilder.API.Challenges
{
    public abstract class ChallengePayloadBase
    {
        public ChallengeArea Challenge { get; } = default!;
        public bool Succeeded { get; } = true;
        public string Reason { get; } = default!;

        public ChallengePayloadBase(ChallengeArea challenge)
        {
            Challenge = challenge;
        }

        public ChallengePayloadBase(bool succeeded, string reason)
        {
            Succeeded = succeeded;
            Reason = reason;
        }


    }
}
