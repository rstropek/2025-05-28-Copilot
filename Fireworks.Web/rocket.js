/**
 * Rocket states
 */
const RocketState = {
    LAUNCHING: 'launching',
    EXPLODING: 'exploding',
    DONE: 'done'
};

/**
 * Rocket class that launches upward and explodes into particles
 */
class Rocket extends Particle {
    constructor(colorHue, startPosition, launchVelocity, strokeWidth) {
        super(colorHue, startPosition, launchVelocity, strokeWidth);
        this.state = RocketState.LAUNCHING;
        this.explosionParticles = [];
        this.rocketTrail = [];
        this.maxRocketTrailLength = 12;
        
        // Initialize rocket trail with starting position
        this.rocketTrail.push({ ...startPosition });
    }

    get isCompletelyDone() {
        return this.state === RocketState.DONE && 
               this.explosionParticles.every(p => p.isDead);
    }

    update() {
        switch (this.state) {
            case RocketState.LAUNCHING:
                super.update();
                
                // Add current position to rocket trail
                this.rocketTrail.push({ ...this.position });
                
                // Remove old trail points to maintain max length
                while (this.rocketTrail.length > this.maxRocketTrailLength) {
                    this.rocketTrail.shift();
                }
                
                // Check if rocket has reached its peak (velocity.y >= 0 means it's going down or stopped)
                if (this.velocity.y >= 0) {
                    this.explode();
                    this.state = RocketState.EXPLODING;
                }
                break;

            case RocketState.EXPLODING:
                // Update all explosion particles
                this.explosionParticles.forEach(particle => particle.update());

                // Check if all particles are dead
                if (this.explosionParticles.every(p => p.isDead)) {
                    this.state = RocketState.DONE;
                }
                break;

            case RocketState.DONE:
                // Nothing to do
                break;
        }
    }

    draw(ctx) {
        switch (this.state) {
            case RocketState.LAUNCHING:
                // Draw rocket trail first (behind the rocket)
                this.drawRocketTrail(ctx);
                
                // Draw the rocket as a bright point
                ctx.save();
                ctx.fillStyle = this.hslToRgb(this.colorHue, 100, 90);
                ctx.beginPath();
                ctx.arc(this.position.x, this.position.y, this.strokeWidth * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                break;

            case RocketState.EXPLODING:
                // Draw all explosion particles
                this.explosionParticles.forEach(particle => particle.draw(ctx));
                break;

            case RocketState.DONE:
                // Nothing to draw
                break;
        }
    }

    drawRocketTrail(ctx) {
        for (let i = 0; i < this.rocketTrail.length - 1; i++) {
            // Calculate alpha for this trail segment (older = more transparent)
            const trailAlpha = (i + 1) / this.rocketTrail.length; // 0.0 to 1.0
            const finalAlpha = trailAlpha * 0.9;
            
            if (finalAlpha > 0.05) {
                // Calculate radius for this trail segment (older = smaller)
                const trailRadius = this.strokeWidth * trailAlpha * 1.8;
                
                ctx.save();
                ctx.globalAlpha = finalAlpha;
                ctx.fillStyle = this.hslToRgb(this.colorHue, 100, 85);
                ctx.beginPath();
                ctx.arc(this.rocketTrail[i].x, this.rocketTrail[i].y, Math.max(trailRadius, 1.0), 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }

    explode() {
        const particleCount = 30; // Number of explosion particles

        for (let i = 0; i < particleCount; i++) {
            // Create particles spreading in all directions
            const explosionVector = RandomFloat.nextVector();
            const explosionSpeed = RandomFloat.nextFloat(2, 8);
            const explosionVelocity = {
                x: explosionVector.x * explosionSpeed,
                y: explosionVector.y * explosionSpeed
            };
            
            // Slight hue variation for more interesting explosion
            const particleHue = this.colorHue + RandomFloat.nextFloat(-30, 30);

            const explosionParticle = new ExplosionParticle(
                particleHue,
                { ...this.position },
                explosionVelocity,
                this.strokeWidth
            );

            this.explosionParticles.push(explosionParticle);
        }
    }
}
