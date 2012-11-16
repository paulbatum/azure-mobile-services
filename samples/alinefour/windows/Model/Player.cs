using System.Runtime.Serialization;
using Microsoft.WindowsAzure.MobileServices;

namespace alinefour.Model
{
    [DataTable(Name = "players")]
    public class Player
    {
        public int Id { get; set; }

        [DataMember(Name = "userId")]
        public string UserId { get; set; }

        [DataMember(Name = "nickname")]
        public string Nickname { get; set; }

        [DataMember(Name = "wnsChannel")]
        public string WnsChannel { get; set; }
    }
}