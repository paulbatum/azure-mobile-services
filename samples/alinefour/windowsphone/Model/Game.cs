using Microsoft.WindowsAzure.MobileServices;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace alinefour.Model
{
    [DataTable("games")]
    public class Game
    {
        public Game()
        {
            Move = -1;
        }

        public int Id { get; set; }

        [JsonProperty(PropertyName = "player1")]
        public string Player1 { get; set; }

        [JsonProperty(PropertyName = "player1Nickname")]
        public string Player1Nickname { get; set; }

        [JsonProperty(PropertyName = "player2")]
        public string Player2 { get; set; }

        [JsonProperty(PropertyName = "player2Nickname")]
        public string Player2Nickname { get; set; }

        [JsonProperty(PropertyName = "activePlayer")]
        public int ActivePlayer { get; set; }

        [JsonProperty(PropertyName = "state")]
        public string State { get; set; }

        [JsonProperty(PropertyName = "move")]
        public int Move { get; set; }

        [JsonProperty(PropertyName = "result")]
        public string Result { get; set; }


        public string Name
        {
            get
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat("Game {0} started by {1}", Id, Player1Nickname);
                if (!String.IsNullOrEmpty(Player2))
                {
                    sb.AppendFormat(" against {0}", Player2Nickname);
                }
                else
                {
                    sb.Append(" and waiting for players");
                }
                return sb.ToString();
            }
        }

        public bool IsUsersTurn(string userId)
        {
            return (ActivePlayer == 1 && String.Equals(Player1, userId) ||
             ActivePlayer == 2 && (String.Equals(Player2, userId) ||
             String.IsNullOrEmpty(Player2)));
        }

        public bool IsGameInProgress
        {
            get
            {
                return ActivePlayer != 0;
            }
        }

        public bool UserWon(string userId)
        {
            return !String.IsNullOrEmpty(Result) && !IsGameInProgress &&
                ((Result.StartsWith("Player 1") && String.Equals(Player1, userId)) ||
                (Result.StartsWith("Player 2") && String.Equals(Player2, userId)));
        }

        public bool IsDraw
        {
            get
            {
                return !String.IsNullOrEmpty(Result) && String.Equals(Result, "Draw");
            }
        }

       
    }
}