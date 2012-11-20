using alinefour.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Data;

namespace alinefour.View
{
    class GameResultConverterToText : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, string language)
        {
            Game game = (Game)value;
            string result = "Draw";

            if (!game.IsDraw)
            {
                if(game.UserWon(App.MobileService.CurrentUser.UserId))
                {
                    result = "You" + Environment.NewLine + "win";
                } else {
                    result = "You" + Environment.NewLine + "lose";
                }
            }
            
            return result;
        }

        public object ConvertBack(object value, Type targetType, object parameter, string language)
        {
            return value;
        }
    }
}
