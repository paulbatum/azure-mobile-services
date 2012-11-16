using Microsoft.WindowsAzure.MobileServices;
using System.Runtime.Serialization;

namespace alinefour.Model
{
    [DataTable(Name = "games")]
    public class Game
    {
        public int Id { get; set; }

        [DataMember(Name = "player1")]
        public string Player1 { get; set; }

        [DataMember(Name = "player2")]
        public string Player2 { get; set; }

        [DataMember(Name = "state")]
        public string State { get; set; }
    }
}