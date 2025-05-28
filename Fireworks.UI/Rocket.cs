using System.Numerics;
using SkiaSharp;

namespace Fireworks.UI;

/// <summary>
/// Class that represents a particle in our digital fireworks display.
/// </summary>
/// <remarks>
/// Each particle has a hue. Each particle also has a starting position (bottom,
/// somewhere on the x axis) and a launch velocity (upwards, always straight up).
/// </remarks>
class Particle(float colorHue, Vector2 startPosition, Vector2 launchVelocity, float strokeWidth)
{
    private static readonly Vector2 Gravity = new(0, 0.2f);

    protected float colorHue = colorHue;
    protected Vector2 position = startPosition;
    protected Vector2 velocity = launchVelocity;
    protected float strokeWidth = strokeWidth;

    public virtual void Draw(SKCanvas canvas)
    {
        SKPaint CreatePaint(float hue, float lightness) => new()
        {
            Color = SKColor.FromHsl(hue, 100, lightness),
            StrokeWidth = strokeWidth,
            StrokeCap = SKStrokeCap.Round,
        };

        using var paint = CreatePaint(colorHue, 100);
        canvas.DrawPoint(position.X, position.Y, paint);
    }

    public virtual void ApplyForce()
    {
    }
}
