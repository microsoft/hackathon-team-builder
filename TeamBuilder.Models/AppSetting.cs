﻿using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TeamBuilder.Models
{
    public enum AppSettingNames
    {
        UseTeams,
        UsePrivateChannels,
        MaxTeamSize,
        EnableAuth,
        GitHubOrg,
        GitHubKey
    }
    public class AppSetting
    {
        [GraphQLName("msTeamId")]
        [StringLength(100)]
        public string MSTeamId { get; set; }
     
        [Required]
        [StringLength(50)]
        public string Setting { get; set; }

        [Required]
        [StringLength(250)]
        public string Value { get; set; }
    }
}