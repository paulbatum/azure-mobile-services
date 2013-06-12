using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using alinefour.Resources;
using Microsoft.WindowsAzure.MobileServices;
using Microsoft.Live;
using System.Threading.Tasks;
using Microsoft.Phone.Notification;
using System.Diagnostics;
using alinefour.Model;

namespace alinefour.View
{
    public partial class MainPage : PhoneApplicationPage
    {
        private IMobileServiceTable<Game> gameTable = App.MobileService.GetTable<Game>();
        private IMobileServiceTable<Player> playerTable = App.MobileService.GetTable<Player>();
        private LiveConnectSession session;

        private async System.Threading.Tasks.Task Authenticate()
        {
            LiveAuthClient liveIdClient = new LiveAuthClient(MobileServiceConfig.LiveClientId);

            while (session == null)
            {
                LiveLoginResult result = await liveIdClient.LoginAsync(new[] { "wl.signin", "wl.basic", "wl.offline_access" });
                if (result.Status == LiveConnectSessionStatus.Connected)
                {
                    session = result.Session;
                    LiveConnectClient client = new LiveConnectClient(result.Session);
                    LiveOperationResult meResult = await client.GetAsync("me");
                    MobileServiceUser loginResult =
                        await App.MobileService.LoginWithMicrosoftAccountAsync(result.Session.AuthenticationToken);

                    Debug.WriteLine("Logged in {0} - {1}", meResult.Result["first_name"], loginResult.UserId);

                    CheckRegistration();
                }
                else
                {
                    session = null;
                    MessageBox.Show("You must log in.", "Login Required", MessageBoxButton.OK);
                }
            }
        }

        private async void CheckRegistration()
        {
            /// Holds the push channel that is created or found.
            HttpNotificationChannel pushChannel;

            // The name of our push channel.
            string channelName = "alinefour";

            // Try to find the push channel.
            pushChannel = HttpNotificationChannel.Find(channelName);

            // If the channel was not found, then create a new connection to the push service.
            if (pushChannel == null)
            {
                pushChannel = new HttpNotificationChannel(channelName);

                // Register for all the events before attempting to open the channel.
                pushChannel.ChannelUriUpdated += new EventHandler<NotificationChannelUriEventArgs>(PushChannel_ChannelUriUpdated);
                pushChannel.ErrorOccurred += new EventHandler<NotificationChannelErrorEventArgs>(PushChannel_ErrorOccurred);

                pushChannel.Open();

                // Bind this new channel for Tile events.
                pushChannel.BindToShellToast();

            }
            else
            {
                // The channel was already open, so just register for all the events.
                pushChannel.ChannelUriUpdated += new EventHandler<NotificationChannelUriEventArgs>(PushChannel_ChannelUriUpdated);
                pushChannel.ErrorOccurred += new EventHandler<NotificationChannelErrorEventArgs>(PushChannel_ErrorOccurred);

                Debug.WriteLine(pushChannel.ChannelUri.ToString());

            }


            var player = (await playerTable.ToListAsync()).SingleOrDefault();
            if (player == null)
            {
                var client = new LiveConnectClient(session);
                LiveOperationResult meResult = await client.GetAsync("me");
                var name = meResult.Result["first_name"].ToString();

                player = new Player
                {
                    Nickname = name,
                    MpnsChannel = pushChannel.ChannelUri.ToString()
                };
                await playerTable.InsertAsync(player);
            }
            else
            {
                player.MpnsChannel = pushChannel.ChannelUri.ToString();
                await playerTable.UpdateAsync(player);
            }
        }

        void PushChannel_ChannelUriUpdated(object sender, NotificationChannelUriEventArgs e)
        {
            Debug.WriteLine(e.ChannelUri.ToString());
        }

        void PushChannel_ErrorOccurred(object sender, NotificationChannelErrorEventArgs e)
        {
            Debug.WriteLine("A push notification {0} error occurred.  {1} ({2}) {3}",
                    e.ErrorType, e.Message, e.ErrorCode, e.ErrorAdditionalData);
        }

        private async Task Refresh()
        {
            List<Game> openGames =
                await gameTable.Where(g => g.Player2 == null)
                .ToListAsync();
            List<Game> myGames =
                await gameTable.Where(g => ((g.Player1 != null && g.Player2 != null) &&
                    (g.Player1 == App.MobileService.CurrentUser.UserId ||
                    g.Player2 == App.MobileService.CurrentUser.UserId))).ToListAsync();
            openGamesList.DataContext = openGames;
            myGamesList.DataContext = myGames;
        }

        async void MainPage_Loaded(object sender, RoutedEventArgs e)
        {
            await Authenticate();
            await Refresh();
        }

        private void PlayGame_OnTapped(object sender, RoutedEventArgs e)
        {
            var cb = (FrameworkElement)sender;
            PhoneApplicationService.Current.State["game"] = cb.DataContext as Game;
            this.NavigationService.Navigate(new Uri("/View/GamePage.xaml", UriKind.Relative));
        }

        private async void JoinGame_OnTapped(object sender, RoutedEventArgs e)
        {
            var cb = (FrameworkElement)sender;

            // Any update on an open game that the player hasn't previously
            // udated is considered a join by the server
            await gameTable.UpdateAsync(cb.DataContext as Game);
            await Refresh();
        }

        private async void ButtonCreate_OnClick(object sender, RoutedEventArgs e)
        {
            await gameTable.InsertAsync(new Game());
            await Refresh();
        }


        // Constructor
        public MainPage()
        {
            InitializeComponent();
            Loaded += MainPage_Loaded;
        }


    }
}