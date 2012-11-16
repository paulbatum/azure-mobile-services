using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Live;
using Microsoft.WindowsAzure.MobileServices;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Networking.PushNotifications;
using Windows.UI.Popups;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using alinefour.Model;

namespace alinefour
{
    public sealed partial class MainPage : Page
    {
        private IMobileServiceTable<Game> gameTable = App.MobileService.GetTable<Game>();
        private IMobileServiceTable<Player> playerTable = App.MobileService.GetTable<Player>(); 

        public MainPage()
        {
            this.InitializeComponent();
        }

        

        protected async override void OnNavigatedTo(NavigationEventArgs e)
        {
            await Authenticate();
            await RefreshGames();
        }

        private LiveConnectSession session;
        private async System.Threading.Tasks.Task Authenticate()
        {
            var liveIdClient = new LiveAuthClient(MobileServiceConfig.ApplicationUri);

            while (session == null)
            {                
                //if (liveIdClient.CanLogout)
                //    liveIdClient.Logout();

                LiveLoginResult result = await liveIdClient.LoginAsync(new[] { "wl.basic" });
                if (result.Status == LiveConnectSessionStatus.Connected)
                {
                    session = result.Session;                    
                    await App.MobileService.LoginAsync(result.Session.AuthenticationToken);
                    await CheckRegistration();

                    //var client = new LiveConnectClient(result.Session);
                    //LiveOperationResult meResult = await client.GetAsync("me");

                    //string title = string.Format("Welcome {0}!", meResult.Result["first_name"]);
                    //var message = string.Format("You are now logged in - {0}", loginResult.UserId);
                    //var dialog = new MessageDialog(message, title);
                    //dialog.Commands.Add(new UICommand("OK"));
                    //await dialog.ShowAsync();
                }
                else
                {
                    session = null;
                    var dialog = new MessageDialog("You must log in.", "Login Required");
                    dialog.Commands.Add(new UICommand("OK"));
                    await dialog.ShowAsync();
                }
            }

        }

        private async Task<string> GetName()
        {
            var client = new LiveConnectClient(session);
            LiveOperationResult meResult = await client.GetAsync("me");
            return meResult.Result["first_name"].ToString();            
        }

        private async Task CheckRegistration()
        {
            var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
            var player = (await playerTable.ToListAsync()).SingleOrDefault();
            if (player == null)
            {
                var name = await GetName();                
                player = new Player {
                    Nickname = name,
                    WnsChannel = channel.Uri
                };
                await playerTable.InsertAsync(player);
            }
            else
            {
                player.WnsChannel = channel.Uri;
                await playerTable.UpdateAsync(player);
            }
        }

        private async Task RefreshGames()
        {
            List<Game> openGames = await gameTable.Where(g => g.Player2 == null)
                         .ToListAsync();


            ListItems.DataContext = openGames;
        }

        private async void ButtonRefresh_Click(object sender, RoutedEventArgs e)
        {
            await RefreshGames();
        }

        private async void ButtonJoin_OnClick(object sender, RoutedEventArgs e)
        {
            var cb = (Button)sender;
            var game = cb.DataContext as Game;
            await gameTable.UpdateAsync(game);
            await RefreshGames();
        }

        private async void ButtonCreate_OnClick(object sender, RoutedEventArgs e)
        {
            await gameTable.InsertAsync(new Game());
            await RefreshGames();
        }
    }
}
