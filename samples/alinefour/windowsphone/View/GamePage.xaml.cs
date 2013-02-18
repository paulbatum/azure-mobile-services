using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using alinefour.Model;
using Newtonsoft.Json;
using System.IO;
using Microsoft.WindowsAzure.MobileServices;

namespace alinefour.View
{
    public partial class GamePage : PhoneApplicationPage
    {
        private Game currentGame = null;
        private IMobileServiceTable<Game> gameTable = App.MobileService.GetTable<Game>();

        public GamePage()
        {
            InitializeComponent();
            board.Moved += board_Moved;

        }

        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            currentGame = PhoneApplicationService.Current.State["game"] as Game;
            RenderGame(currentGame);
        }

        private void RenderGame(Game g)
        {
            JsonSerializer ser = new JsonSerializer();
            List<List<int>> result = (List<List<int>>)ser.Deserialize(
                new JsonTextReader(new StringReader(g.State ?? String.Empty)),
                typeof(List<List<int>>));
            board.Render(result);
        }

        async void board_Moved(object sender, GameBoardEventArgs e)
        {
            if (currentGame.IsGameInProgress &&
                currentGame.IsUsersTurn(App.MobileService.CurrentUser.UserId))
            {
                currentGame.Move = (int)e.MoveColumn;
                await gameTable.UpdateAsync(currentGame);
                List<Game> updatedGame = await gameTable.Where(g => g.Id == currentGame.Id).ToListAsync();
                RenderGame(updatedGame[0]);
            }
            else
            {
                MessageBox.Show("The game has finished, or it is not your turn to play",
                    "You can't make a move", MessageBoxButton.OK);
            }
        }

    }
}