using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamBuilder.Models
{
    public class Team
    {
        public int Id { get; set; }
        [Required]
        [StringLength(200)]
        public string? Name { get; set; }
        [StringLength(4000)]
        public string? Description { get; set; }
        [Required]
        public int ChallengeAreaId { get; set; }
        public ChallengeArea? Challenge { get; set; }
        public string? ChannelId { get; set; }
        public ICollection<TeamMember>? TeamMembers { get; set; } = new List<TeamMember>();
    }
}