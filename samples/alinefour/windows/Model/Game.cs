using Microsoft.WindowsAzure.MobileServices;
using System;
using System.Runtime.Serialization;

namespace alinefour.Model
{
    [DataTable(Name = "games")]
    public class Game
    {
        public Game()
        {
            Move = -1;
        }

        public int Id { get; set; }

        [DataMember(Name = "player1")]
        public string Player1 { get; set; }

        [DataMember(Name = "player2")]
        public string Player2 { get; set; }

        [DataMember(Name = "activePlayer")]
        public int ActivePlayer { get; set; }

        [DataMember(Name = "state")]
        public string State { get; set; }

        [DataMember(Name = "move")]
        public int Move { get; set; }

        [DataMember(Name = "result")]
        public string Result { get; set; }


        public string Name
        {
            get
            {
                return String.Format("Game {0} started by {1}", Id, Player1);
            }
        }

        public bool IsCurrentUsersTurn
        {
            get
            {
                return (ActivePlayer == 1 && String.Equals(Player1, App.MobileService.CurrentUser.UserId) ||
                    ActivePlayer == 2 && (String.Equals(Player2, App.MobileService.CurrentUser.UserId) ||
                    String.IsNullOrEmpty(Player2)));
            }
        }

        public bool IsGameInProgress
        {
            get
            {
                return ActivePlayer != 0;
            }
        }

        public bool CurrentUserWon
        {
            get
            {
                return !String.IsNullOrEmpty(Result) && !IsGameInProgress &&
                    ((Result.StartsWith("Player 1") && String.Equals(Player1, App.MobileService.CurrentUser.UserId)) ||
                    (Result.StartsWith("Player 2") && String.Equals(Player2, App.MobileService.CurrentUser.UserId)));
            }
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