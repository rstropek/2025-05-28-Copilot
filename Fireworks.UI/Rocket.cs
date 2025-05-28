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
    protected float lifespan = 1.0f;

    public bool IsDead => lifespan <= 0;

    public virtual void Update()
    {
        velocity += Gravity;
        position += velocity;
        ApplyForce();
    }

    public virtual void Draw(SKCanvas canvas)
    {
        SKPaint CreatePaint(float hue, float lightness, float alpha) => new()
        {
            Color = SKColor.FromHsl(hue, 100, lightness, (byte)(alpha * 255)),
            StrokeWidth = strokeWidth,
            StrokeCap = SKStrokeCap.Round,
        };

        using var paint = CreatePaint(colorHue, 50, lifespan);
        canvas.DrawPoint(position.X, position.Y, paint);
    }

    public virtual void ApplyForce()
    {
    }
}

class ExplosionParticle : Particle
{
    private readonly float fadeRate;
    private readonly Queue<Vector2> trail = new();
    private const int MaxTrailLength = 15; // Longer trail for more dramatic effect

    public ExplosionParticle(float colorHue, Vector2 startPosition, Vector2 launchVelocity, float strokeWidth)
        : base(colorHue, startPosition, launchVelocity, strokeWidth)
    {
        fadeRate = 1.0f / (2.0f * 60); // Fade over 2 seconds at 60 FPS
        lifespan = 1.0f;
        
        // Initialize trail with starting position
        trail.Enqueue(startPosition);
    }

    public override void Update()
    {
        base.Update();
        lifespan -= fadeRate;
        if (lifespan < 0) lifespan = 0;
        
        // Add current position to trail
        trail.Enqueue(position);
        
        // Remove old trail points to maintain max length
        while (trail.Count > MaxTrailLength)
        {
            trail.Dequeue();
        }
    }    public override void Draw(SKCanvas canvas)
    {
        if (lifespan > 0)
        {
            // Draw trail first (behind the particle)
            DrawTrail(canvas);
            
            // Draw the main particle with enhanced visibility
            SKPaint CreatePaint(float hue, float lightness, float alpha) => new()
            {
                Color = SKColor.FromHsl(hue, 100, lightness, (byte)(alpha * 255)),
                StrokeWidth = strokeWidth * 1.3f, // Make main particle slightly larger
                StrokeCap = SKStrokeCap.Round,
            };

            using var paint = CreatePaint(colorHue, 80, lifespan); // Brighter main particle
            canvas.DrawPoint(position.X, position.Y, paint);
        }
    }private void DrawTrail(SKCanvas canvas)
    {
        var trailPositions = trail.ToArray();
        
        for (int i = 0; i < trailPositions.Length - 1; i++)
        {
            // Calculate alpha for this trail segment (older = more transparent)
            var trailAlpha = (float)(i + 1) / trailPositions.Length; // 0.0 to 1.0
            trailAlpha *= lifespan; // Also fade with particle lifespan
            trailAlpha *= 0.9f; // Make trail more opaque for stronger effect
            
            if (trailAlpha > 0.01f) // Only draw if visible enough
            {
                // Calculate stroke width for this trail segment (older = thinner)
                var trailStrokeWidth = strokeWidth * trailAlpha * 1.2f; // Thicker trails
                
                SKPaint CreateTrailPaint(float hue, float alpha, float width) => new()
                {
                    Color = SKColor.FromHsl(hue, 95, 60, (byte)(alpha * 255)), // Brighter and more saturated
                    StrokeWidth = Math.Max(width, 0.8f), // Higher minimum width for visibility
                    StrokeCap = SKStrokeCap.Round,
                };

                using var trailPaint = CreateTrailPaint(colorHue, trailAlpha, trailStrokeWidth);
                canvas.DrawPoint(trailPositions[i].X, trailPositions[i].Y, trailPaint);
            }
        }
    }
}

class Rocket : Particle
{
    private RocketState state = RocketState.Launching;
    private List<ExplosionParticle> explosionParticles = new();
    private readonly Queue<Vector2> rocketTrail = new();
    private const int MaxRocketTrailLength = 12; // Longer trail for rocket

    public Rocket(float colorHue, Vector2 startPosition, Vector2 launchVelocity, float strokeWidth)
        : base(colorHue, startPosition, launchVelocity, strokeWidth)
    {
        // Initialize rocket trail with starting position
        rocketTrail.Enqueue(startPosition);
    }

    public bool IsCompletelyDone => state == RocketState.Done && explosionParticles.All(p => p.IsDead);

    public override void Update()
    {
        switch (state)
        {
            case RocketState.Launching:
                base.Update();
                
                // Add current position to rocket trail
                rocketTrail.Enqueue(position);
                
                // Remove old trail points to maintain max length
                while (rocketTrail.Count > MaxRocketTrailLength)
                {
                    rocketTrail.Dequeue();
                }
                
                // Check if rocket has reached its peak (velocity.Y >= 0 means it's going down or stopped)
                if (velocity.Y >= 0)
                {
                    Explode();
                    state = RocketState.Exploding;
                }
                break;

            case RocketState.Exploding:
                // Update all explosion particles
                foreach (var particle in explosionParticles)
                {
                    particle.Update();
                }

                // Check if all particles are dead
                if (explosionParticles.All(p => p.IsDead))
                {
                    state = RocketState.Done;
                }
                break;

            case RocketState.Done:
                // Nothing to do
                break;
        }
    }    public override void Draw(SKCanvas canvas)
    {
        switch (state)
        {
            case RocketState.Launching:
                {
                    // Draw rocket trail first (behind the rocket)
                    DrawRocketTrail(canvas);
                    
                    // Draw the rocket as a bright point
                    SKPaint CreatePaint(float hue, float lightness) => new()
                    {
                        Color = SKColor.FromHsl(hue, 100, lightness),
                        StrokeWidth = strokeWidth * 2, // Make rocket bigger
                        StrokeCap = SKStrokeCap.Round,
                    };

                    using var paint = CreatePaint(colorHue, 90);
                    canvas.DrawPoint(position.X, position.Y, paint);
                    break;
                }

            case RocketState.Exploding:
                // Draw all explosion particles
                foreach (var particle in explosionParticles)
                {
                    particle.Draw(canvas);
                }
                break;

            case RocketState.Done:
                // Nothing to draw
                break;
        }
    }
      private void DrawRocketTrail(SKCanvas canvas)
    {
        var trailPositions = rocketTrail.ToArray();
        
        for (int i = 0; i < trailPositions.Length - 1; i++)
        {
            // Calculate alpha for this trail segment (older = more transparent)
            var trailAlpha = (float)(i + 1) / trailPositions.Length; // 0.0 to 1.0
            trailAlpha *= 0.9f; // Make trail more opaque for stronger effect
            
            if (trailAlpha > 0.05f) // Only draw if visible enough
            {
                // Calculate stroke width for this trail segment (older = thinner)
                var trailStrokeWidth = strokeWidth * trailAlpha * 1.8f; // Thicker rocket trails
                
                SKPaint CreateTrailPaint(float hue, float alpha, float width) => new()
                {
                    Color = SKColor.FromHsl(hue, 100, 85, (byte)(alpha * 255)), // Brighter rocket trail
                    StrokeWidth = Math.Max(width, 1.0f), // Higher minimum width
                    StrokeCap = SKStrokeCap.Round,
                };

                using var trailPaint = CreateTrailPaint(colorHue, trailAlpha, trailStrokeWidth);
                canvas.DrawPoint(trailPositions[i].X, trailPositions[i].Y, trailPaint);
            }
        }
    }

    private void Explode()
    {
        const int particleCount = 30; // Number of explosion particles

        for (int i = 0; i < particleCount; i++)
        {
            // Create particles spreading in all directions
            var explosionVelocity = RandomFloat.NextVector() * RandomFloat.NextFloat(2, 8);
            var particleHue = colorHue + RandomFloat.NextFloat(-30, 30); // Slight hue variation

            var explosionParticle = new ExplosionParticle(
                particleHue,
                position,
                explosionVelocity,
                strokeWidth
            );

            explosionParticles.Add(explosionParticle);
        }
    }
}

enum RocketState
{
    Launching,
    Exploding,
    Done,
}

