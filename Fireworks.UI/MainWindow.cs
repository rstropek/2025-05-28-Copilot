using System.Diagnostics;
using Avalonia.Controls;
using Avalonia.Controls.Skia;
using Avalonia.Threading;
using SkiaSharp;

namespace Fireworks.UI;

public class MainWindow : Window
{
    private readonly DispatcherTimer _timer;

    public MainWindow()
    {
        var canvasControl = new SKCanvasControl();
        canvasControl.Draw += (sender, e) =>
        {
        };
        Content = canvasControl;

        _timer = new DispatcherTimer { Interval = TimeSpan.FromSeconds(1.0 / 60) };
        _timer.Tick += (sender, e) => canvasControl.InvalidateVisual();
        _timer.Start();
    }
}