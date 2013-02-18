using alinefour.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Data;

namespace alinefour.View
{
    public class GameResultConverterToText : IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            Game game = (Game)value;
            string result = "Draw";

            if (!game.IsDraw)
            {
                if (game.UserWon(App.MobileService.CurrentUser.UserId))
                {
                    result = "You" + Environment.NewLine + "win";
                }
                else
                {
                    result = "You" + Environment.NewLine + "lose";
                }
            }

            return result;
        }

        public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            return value;
        }
    }
}
