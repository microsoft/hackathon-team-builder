using System;
using System.Collections.Generic;

namespace TeamBuilder.API.Data 
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ChallengeArea Challenge { get; set; }
    }

    public class ChallengeArea
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Prefix { get; set; }
        public string Description { get; set; }
        public IList<Team> Teams { get; set; }
    }
}