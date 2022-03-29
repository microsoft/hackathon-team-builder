using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using TeamBuilder.API.Common;
using TeamBuilder.API.Data;
using TeamBuilder.API.Services;
namespace TeamBuilder.API.AppSettings
{
    [ExtendObjectType(OperationTypeNames.Mutation)]
    public class AppSettingMutation
    {
        [UseTeamBuilderDbContext]
        public async Task<AddAppSettingPayload> AddAppSettingAsync(
           AddAppSettingInput input,
           [ScopedService] TeamBuilderDbContext context,
           [Service] IMessageService messageService)
        {
            var appSetting = new AppSetting
            {
                MSTeamId = input.MSTeamId,
                Setting = input.Setting,
                Value = input.Value
            };

            context.AppSettings.Add(appSetting);
            await context.SaveChangesAsync();

            await messageService.SendAsync(appSetting, MutationType.Create);

            return new AddAppSettingPayload(appSetting);
        }

        [UseTeamBuilderDbContext]
        public async Task<EditAppSettingPayload> EditAppSettingAsync(
            EditAppSettingInput input,
            [ScopedService] TeamBuilderDbContext context,
            [Service] IMessageService messageService)
        {
            var appSetting2Edit = await context.AppSettings.FindAsync(input.MSTeamId);
            if (appSetting2Edit == null)
            {
                return new EditAppSettingPayload(new UserError("Item to edit was not found.", "404"));
            }

            appSetting2Edit.Setting = input.Setting;
            appSetting2Edit.Value = input.Value;

            context.Entry(appSetting2Edit).State = EntityState.Modified;
            await context.SaveChangesAsync();

            await messageService.SendAsync(appSetting2Edit, MutationType.Update);

            return new EditAppSettingPayload(appSetting2Edit);
        }




    }
}
