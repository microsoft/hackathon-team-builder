using System.Reflection;
using TeamBuilder.API.Data;
using HotChocolate.Types;
using HotChocolate.Types.Descriptors;

namespace TeamBuilder.API
{
    public class UseTeamBuilderDbContextAttribute : ObjectFieldDescriptorAttribute
    {
        public override void OnConfigure(IDescriptorContext context, IObjectFieldDescriptor descriptor, MemberInfo member)
        {
            descriptor.UseDbContext<TeamBuilderDbContext>();
        }
    }
}