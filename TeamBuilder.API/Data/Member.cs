using System.ComponentModel.DataAnnotations;

namespace TeamBuilder.API.Data
{
    public class Member
    {
        [Required]
        [Key]
        public string UserId { get; set; } = default!;
        public string FirstName { get; set; } = default!;
        public string LastName {  get; set; } = default!;
        public string FullName {  get; set; } = default!;
    }
}
