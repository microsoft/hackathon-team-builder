using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TeamBuilder.Models
{
    public class ChallengeArea
    {
        public int Id { get; set; }
        [Required]
        [StringLength(200)]
        public string? Name { get; set; }
        [Required]
        [StringLength(12)]
        public string? Prefix { get; set; }
        [StringLength(4000)]
        public string? Description { get; set; }
        public ICollection<Team> Teams { get; set; } = new List<Team>();
    }
}