﻿using HotChocolate;
using HotChocolate.AspNetCore.Authorization;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using TeamBuilder.API.Data;
using TeamBuilder.API.Services;
using TeamBuilder.Models;

namespace TeamBuilder.API.Challenges
{
    [Authorize]
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class ChallengeMutations
    {
        /// <summary>
        /// Add a new Challenge
        /// </summary>
        /// <param name="input"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        /// <example>
        /// mutation addChallenge {
        ///        addChallenge(input: {
        ///        name: "Challenge Create"
        ///          description: "Sample challenge"
        ///          prefix: "create"
        ///        }) {
        ///    challenge {
        ///      id
        ///      name
        ///      description
        ///      prefix
        ///    }
        ///   }
        /// }
        /// </example>
        [UseTeamBuilderDbContext]
        public async Task<AddChallengePayload> AddChallengeAsync(
            AddChallengeInput input,
            [ScopedService] TeamBuilderDbContext context,
            [Service] IMessageService messageService)
        {
            var challenge = new ChallengeArea
            {
                Name = input.Name,
                Prefix = input.Prefix,
                Description = input.Description
            };

            context.Challenges.Add(challenge);
            await context.SaveChangesAsync();

            await messageService.SendAsync(challenge, MutationType.Create);

            return new AddChallengePayload(challenge);
        }

        /// <summary>
        /// Edit a Challenge
        /// </summary>
        /// <param name="id"></param>
        /// <param name="input"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        /// <example>
        /// mutation editChallenge {
        ///         editChallenge(id: 3, input: {
        ///         name: "Challenge Update"
        ///           description: "An updated challenge"
        ///           prefix: "update"
        ///         }) {
        ///     challenge {
        ///       id
        ///     }
        ///   }
        /// }
        /// </example>
        [UseTeamBuilderDbContext]
        public async Task<EditChallengePayload> EditChallengeAsync(
            int id,
            EditChallengeInput input,
            [ScopedService] TeamBuilderDbContext context,
            [Service] IMessageService messageService)
        {
            var existingItem = await context.Challenges.FindAsync(id);
            if (existingItem == null)
            {
                return new EditChallengePayload(false, "Item not found.");
            }

            existingItem.Name = string.IsNullOrEmpty(input.Name) ? existingItem.Name : input.Name;
            existingItem.Prefix = string.IsNullOrEmpty(input.Prefix) ? existingItem.Prefix : input.Prefix;
            existingItem.Description = string.IsNullOrEmpty(input.Description) ? existingItem.Description : input.Description;
            
            await context.SaveChangesAsync();

            await messageService.SendAsync(existingItem, MutationType.Update);

            return new EditChallengePayload(existingItem);
        }

        /// <summary>
        /// Delete a Challenge
        /// </summary>
        /// <param name="id"></param>
        /// <param name="context"></param>
        /// <returns></returns>
        /// <example>
        /// mutation deleteChallenge {
        ///    deleteChallenge(id: 3)
        ///    {
        ///        succeeded reason
        ///    }
        /// }
        /// </example>
        [UseTeamBuilderDbContext]
        public async Task<DeleteChallengePayload> DeleteChallengeAsync(
                int id,
                [ScopedService] TeamBuilderDbContext context,
                [Service] IMessageService messageService)
        {
            var existingItem = await context.Challenges.FindAsync(id);
            if (existingItem == null)
            {
                return new DeleteChallengePayload(false, "Item not found.");
            }
            context.Challenges.Remove(existingItem);
            await context.SaveChangesAsync();

            await messageService.SendAsync(existingItem, MutationType.Delete);

            return new DeleteChallengePayload(true, "Deleted");
        }
    }
}
