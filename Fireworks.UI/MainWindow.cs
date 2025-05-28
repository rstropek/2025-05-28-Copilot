using System.Diagnostics;
using System.Numerics;
using Avalonia.Controls;
using Avalonia.Controls.Skia;
using Avalonia.Threading;
using SkiaSharp;

namespace Fireworks.UI;

public class MainWindow : Window
{
    private readonly DispatcherTimer _timer;
    private readonly List<Rocket> _rockets = new();
    private int _frameCount = 0;

    public MainWindow()
    {
        Width = 800;
        Height = 600;
        Title = "Fireworks Display";
        
        var canvasControl = new SKCanvasControl();
        canvasControl.Draw += OnDraw;
        Content = canvasControl;

        _timer = new DispatcherTimer { Interval = TimeSpan.FromSeconds(1.0 / 60) };
        _timer.Tick += OnTimerTick;
        _timer.Start();
    }

    private void OnTimerTick(object? sender, EventArgs e)
    {
        _frameCount++;
        
        // Create a new rocket every 1 second (60 frames at 60 FPS)
        if (_frameCount % 60 == 0)
        {
            CreateRocket();
        }
        
        // Update all rockets
        foreach (var rocket in _rockets)
        {
            rocket.Update();
        }
        
        // Remove completed rockets
        _rockets.RemoveAll(r => r.IsCompletelyDone);
        
        // Invalidate to trigger redraw
        ((SKCanvasControl)Content!).InvalidateVisual();
    }

    private void OnDraw(object? sender, SKCanvasEventArgs e)
    {
        var canvas = e.Canvas;
        canvas.Clear(SKColors.Black);
        
        // Draw all rockets
        foreach (var rocket in _rockets)
        {
            rocket.Draw(canvas);
        }
    }

    private void CreateRocket()
    {
        var startX = RandomFloat.NextFloat(100, (float)Width - 100);
        var startY = (float)Height - 50; // Start near bottom
        var startPosition = new Vector2(startX, startY);
        
        var launchVelocity = new Vector2(0, RandomFloat.NextFloat(-12, -8)); // Launch upward
        var hue = RandomFloat.NextFloat(0, 360); // Random color
        
        var rocket = new Rocket(hue, startPosition, launchVelocity, 3.0f);
        _rockets.Add(rocket);
    }
}