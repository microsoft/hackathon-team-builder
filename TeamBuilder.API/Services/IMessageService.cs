using System.Threading.Tasks;

namespace TeamBuilder.API.Services
{
    public interface IMessageService
    {
        Task SendAsync<T>(T entity, MutationType mutationType);
    }

    public enum MutationType
    {
        Create,
        Update,
        Delete
    }
}
