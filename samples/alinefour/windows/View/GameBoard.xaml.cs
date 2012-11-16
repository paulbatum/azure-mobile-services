using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using Windows.UI.Xaml.Shapes;

// The User Control item template is documented at http://go.microsoft.com/fwlink/?LinkId=234236

namespace alinefour
{
    public class GameBoardEventArgs : EventArgs
    {
        public int MoveRow { get; set; }
        public int MoveColumn { get; set; }
    }

    public sealed partial class GameBoard : UserControl
    {
        public event EventHandler<GameBoardEventArgs> Moved;

        protected void OnMoved(GameBoardEventArgs e)
        {
            if (Moved != null)
            {
                Moved(this, e);
            }
        }
      
        public GameBoard()
        {
            this.InitializeComponent();
            this.Tapped += GameBoard_Tapped;
        }

        void GameBoard_Tapped(object sender, TappedRoutedEventArgs e)
        {
            if (e.OriginalSource != null)
            {
                FrameworkElement fe = null;
                if (e.OriginalSource is Border)
                {
                    fe = (FrameworkElement)e.OriginalSource;
                } else if (e.OriginalSource is Ellipse){
                    fe = (FrameworkElement)(e.OriginalSource as Ellipse).Parent;
                }

                OnMoved(new GameBoardEventArgs {
                    MoveColumn = Grid.GetColumn(fe),
                    MoveRow = Grid.GetRow(fe)
                });
            }
            
        }

        public void Render(List<List<int>> board)
        {
            for (int column = 0; column < board.Count; column++)
            {
                for (int row = 0; row < board[column].Count; row++)
                {
                    Border b = (Border)grid.Children
                        .Where<UIElement>(c => Grid.GetRow((FrameworkElement)c) == row
                            && Grid.GetColumn((FrameworkElement)c) == column)
                        .FirstOrDefault();

                    if (b != null)
                    {
                        Ellipse e = (Ellipse)b.Child;

                        if (e != null)
                        {
                            switch (board[column][row])
                            {
                                case 1:
                                    e.Style = (Style)this.Resources["Player1"];
                                    break;
                                case 2:
                                    e.Style = (Style)this.Resources["Player2"];
                                    break;
                                default:
                                    e.Style = (Style)this.Resources["Clear"];
                                    break;
                            }
                        }
                    }
                }
            }
        }
    }
}
