using System.Runtime.Serialization;
using Microsoft.WindowsAzure.MobileServices;
using Newtonsoft.Json;

namespace alinefour.Model
{
    [DataTable("players")]
    public class Player
    {
        public int Id { get; set; }

        [JsonProperty(PropertyName = "userId")]
        public string UserId { get; set; }

        [JsonProperty(PropertyName = "nickname")]
        public string Nickname { get; set; }

        [JsonProperty(PropertyName = "wnsChannel")]
        public string WnsChannel { get; set; }

        [JsonProperty(PropertyName = "mpnsChannel")]
        public string MpnsChannel { get; set; }
    }
}