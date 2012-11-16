using alinefour.Model;
using Microsoft.WindowsAzure.MobileServices;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Windows.Data.Json;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkId=234238

namespace alinefour.View
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class GamePage : Page
    {
        private Game currentGame = null;
        private IMobileServiceTable<Game> gameTable = App.MobileService.GetTable<Game>();

        public GamePage()
        {
            this.InitializeComponent();
        }

        /// <summary>
        /// Invoked as an event handler to navigate backward in the navigation stack
        /// associated with this page's <see cref="Frame"/>.
        /// </summary>
        /// <param name="sender">Instance that triggered the event.</param>
        /// <param name="e">Event data describing the conditions that led to the
        /// event.</param>
        protected void GoBack(object sender, RoutedEventArgs e)
        {
            // Use the navigation frame to return to the previous page
            if (this.Frame != null && this.Frame.CanGoBack) this.Frame.GoBack();
        }

        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.  The Parameter
        /// property is typically used to configure the page.</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            currentGame = (Game)e.Parameter;

            JsonSerializer ser = new JsonSerializer();
            List<List<int>> result = (List<List<int>>)ser.Deserialize(new JsonTextReader(new StringReader(currentGame.State)), 
                typeof(List<List<int>>));

            board.Moved += board_Moved;
           
            board.Render(result);
        }

        async void board_Moved(object sender, GameBoardEventArgs e)
        {
            currentGame.Move = (int)e.MoveColumn;
            await gameTable.UpdateAsync(currentGame);

        }
    }
}
