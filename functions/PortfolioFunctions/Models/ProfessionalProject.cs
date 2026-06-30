using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace PortfolioFunctions.Models
{
    public class ProfessionalProject
    {
        [JsonProperty("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [JsonProperty("name")]
        public string? Name { get; set; }

        [JsonProperty("description")]
        public string? Description { get; set; }

        [JsonProperty("developerCommentary")]
        public string? DeveloperCommentary { get; set; }

        [JsonProperty("marketingSiteUrl")]
        public string? MarketingSiteUrl { get; set; }

        [JsonProperty("demoUrl")]
        public string? DemoUrl { get; set; }

        [JsonProperty("screenshots")]
        public List<string> Screenshots { get; set; } = new List<string>();
    }
}
