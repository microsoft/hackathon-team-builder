using Microsoft.Graph;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TeamBuilder.Models
{
    public class Member
    {             
        public string UserId { get; set; } = default!;
        public string UserEmail { get; set; } = default!;
        public string FirstName { get; set; } = default!;
        public string LastName {  get; set; } = default!;
        public string FullName {  get; set; } = default!;
        public string AvatarUrl { get; set; } = default!;
        public string OnlineStatus {  get; set; } = default!;
    }
}
