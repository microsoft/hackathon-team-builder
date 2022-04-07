using HotChocolate;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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
            if (string.IsNullOrEmpty(input.msTeamId))
            {
                return new AppSettingPayload(new UserError("msTeamId is a required field.", "400"));
            }
            var appSetting = new AppSetting
            {
                MSTeamId = input.msTeamId,
                Setting = input.setting,
                Value = input.value
            };

            context.AppSettings.Add(appSetting);
            await context.SaveChangesAsync();

            await messageService.SendAsync(appSetting, MutationType.Create);

            return new AppSettingPayload(appSetting);
        }

        [UseTeamBuilderDbContext]
        public async Task<AppSettingsPayload> AddAppSettingsAsync(
            IList<AppSettingInput> input,
            [ScopedService] TeamBuilderDbContext context,
            [Service] IMessageService messageService
        )
        {
            List<AppSetting> results = new List<AppSetting>();

            var msTeamId = input[0].msTeamId;
            if (string.IsNullOrEmpty(msTeamId))
            {
                return new AppSettingsPayload(new UserError("msTeamId is required.", "400"));
            }
            var settingsDb = context.AppSettings.Where(a => a.MSTeamId == msTeamId).ToList();
            foreach (var s in input)
            {
                var existing = settingsDb.FirstOrDefault(a => a.Setting == s.setting);
                if (existing != null)
                {
                    var entry = context.Entry(existing);
                    existing.Value = s.value;
                    results.Add(existing);
                }
                else
                {
                    var newSetting = new AppSetting
                    {
                        MSTeamId = s.msTeamId,
                        Setting = s.setting,
                        Value = s.value
                    };
                    context.Add(newSetting);
                    results.Add(newSetting);
                }
            }
            await context.SaveChangesAsync();
            return new AppSettingsPayload(results);
        }

        [UseTeamBuilderDbContext]
        public async Task<AppSettingPayload> EditAppSettingAsync(
            AppSettingInput input,
            [ScopedService] TeamBuilderDbContext context,
            [Service] IMessageService messageService)
        {
            //var appSetting2Edit = await context.AppSettings.FindAsync(input.MSTeamId);
            var appSetting2Edit = context.AppSettings
                .Where(a => a.MSTeamId == input.msTeamId && a.Setting == input.setting)
                .FirstOrDefault();

            if (appSetting2Edit == null)
            {
                return new AppSettingPayload(new UserError("Item to edit was not found.", "404"));
            }

            appSetting2Edit.Value = input.value;

            context.Entry(appSetting2Edit).State = EntityState.Modified;
            await context.SaveChangesAsync();

            await messageService.SendAsync(appSetting2Edit, MutationType.Update);

            return new AppSettingPayload(appSetting2Edit);
        }

        [UseTeamBuilderDbContext]
        public async Task<RemoveAppSettingPayload> RemoveAppSettingAsync(
            RemoveAppSettingInput input,
            [ScopedService] TeamBuilderDbContext context,
            [Service] IMessageService messageService)
        {
            var setting2Delete = context.AppSettings.Where(s => s.MSTeamId == input.msTeamId && s.Setting == input.setting).FirstOrDefault();
            if (setting2Delete == null)
            {
                return new RemoveAppSettingPayload(new[] { new UserError("Item to delete was not found.", "404") });
            }

            context.AppSettings.Remove(setting2Delete);
            await context.SaveChangesAsync();

            await messageService.SendAsync(setting2Delete, MutationType.Delete);

            return new RemoveAppSettingPayload();
        }

        [UseTeamBuilderDbContext]
        public async Task<RemoveAppSettingPayload> ClearAppSettingsAsync(
            ClearAppSettingsInput input,
            [ScopedService] TeamBuilderDbContext context,
            [Service] IMessageService messageService)
        {
            var settings = context.AppSettings.Where(s => s.MSTeamId == input.msTeamId).ToList();
            foreach (var setting in settings)
            {
                context.AppSettings.Remove(setting);
            }
            await context.SaveChangesAsync();

            return new RemoveAppSettingPayload();
        }

    }
}
