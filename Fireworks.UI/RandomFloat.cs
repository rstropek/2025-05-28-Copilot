using System.Numerics;

namespace Fireworks.UI;

/// <summary>
/// Helper class providing methods for generating random floating-point numbers.
/// </summary>
static class RandomFloat
{
    public static float NextFloat(float min, float max) =>
        Random.Shared.NextSingle() * (max - min) + min;

    public static Vector2 NextVector()
    {
        var angle = NextFloat(0, MathF.PI * 2);
        return new Vector2(MathF.Cos(angle), MathF.Sin(angle));
    }
}