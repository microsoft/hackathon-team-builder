using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System.Linq;
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
        public async Task<AppSettingPayload> AddAppSettingAsync(
           AppSettingInput input,
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

            return new AppSettingPayload(appSetting);
        }

        [UseTeamBuilderDbContext]
        public async Task<AppSettingPayload> EditAppSettingAsync(
            AppSettingInput input,
            [ScopedService] TeamBuilderDbContext context,
            [Service] IMessageService messageService)
        {
            //var appSetting2Edit = await context.AppSettings.FindAsync(input.MSTeamId);
            var appSetting2Edit = context.AppSettings
                .Where(a => a.MSTeamId == input.MSTeamId && a.Setting == input.Setting)
                .FirstOrDefault();

            if (appSetting2Edit == null)
            {
                return new AppSettingPayload(new UserError("Item to edit was not found.", "404"));
            }
            
            appSetting2Edit.Value = input.Value;

            context.Entry(appSetting2Edit).State = EntityState.Modified;
            await context.SaveChangesAsync();

            await messageService.SendAsync(appSetting2Edit, MutationType.Update);

            return new AppSettingPayload(appSetting2Edit);
        }




    }
}
