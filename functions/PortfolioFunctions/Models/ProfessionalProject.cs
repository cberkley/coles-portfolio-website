using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

namespace PortfolioFunctions.Models
{
    public class ProfessionalProject
    {
        [JsonProperty("id")]
        [JsonPropertyName("id")]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [JsonProperty("name")]
        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonProperty("description")]
        [JsonPropertyName("description")]
        public string? Description { get; set; }

        [JsonProperty("developerCommentary")]
        [JsonPropertyName("developerCommentary")]
        public string? DeveloperCommentary { get; set; }

        [JsonProperty("marketingSiteUrl")]
        [JsonPropertyName("marketingSiteUrl")]
        public string? MarketingSiteUrl { get; set; }

        [JsonProperty("demoUrl")]
        [JsonPropertyName("demoUrl")]
        public string? DemoUrl { get; set; }

        [JsonProperty("screenshots")]
        [JsonPropertyName("screenshots")]
        public List<string> Screenshots { get; set; } = new List<string>();
    }
}
