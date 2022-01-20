namespace TeamBuilder.API.Challenges
{
    public class DeleteChallengePayload : ChallengePayloadBase
    {
        public DeleteChallengePayload(bool succeeded, string reason) : base(succeeded, reason) { }
    }
}
