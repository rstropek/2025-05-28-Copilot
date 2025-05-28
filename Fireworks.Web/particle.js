/**
 * Base class that represents a particle in our digital fireworks display.
 */
class Particle {
    static gravity = { x: 0, y: 0.2 };

    constructor(colorHue, startPosition, launchVelocity, strokeWidth) {
        this.colorHue = colorHue;
        this.position = { ...startPosition };
        this.velocity = { ...launchVelocity };
        this.strokeWidth = strokeWidth;
        this.lifespan = 1.0;
    }

    get isDead() {
        return this.lifespan <= 0;
    }

    update() {
        // Apply gravity
        this.velocity.x += Particle.gravity.x;
        this.velocity.y += Particle.gravity.y;
        
        // Update position
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        this.applyForce();
    }

    draw(ctx) {
        const alpha = Math.max(0, this.lifespan);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.hslToRgb(this.colorHue, 100, 50);
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.strokeWidth, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    applyForce() {
        // Override in subclasses
    }

    /**
     * Convert HSL to RGB color string
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-100)
     * @param {number} l - Lightness (0-100)
     * @returns {string} RGB color string
     */
    hslToRgb(h, s, l) {
        h = h % 360;
        s = s / 100;
        l = l / 100;

        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;

        let r, g, b;

        if (0 <= h && h < 60) {
            [r, g, b] = [c, x, 0];
        } else if (60 <= h && h < 120) {
            [r, g, b] = [x, c, 0];
        } else if (120 <= h && h < 180) {
            [r, g, b] = [0, c, x];
        } else if (180 <= h && h < 240) {
            [r, g, b] = [0, x, c];
        } else if (240 <= h && h < 300) {
            [r, g, b] = [x, 0, c];
        } else {
            [r, g, b] = [c, 0, x];
        }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        return `rgb(${r}, ${g}, ${b})`;
    }
}

/**
 * Explosion particle that has a fading trail effect
 */
class ExplosionParticle extends Particle {
    constructor(colorHue, startPosition, launchVelocity, strokeWidth) {
        super(colorHue, startPosition, launchVelocity, strokeWidth);
        this.fadeRate = 1.0 / (2.0 * 60); // Fade over 2 seconds at 60 FPS
        this.lifespan = 1.0;
        this.trail = [];
        this.maxTrailLength = 15;
        
        // Initialize trail with starting position
        this.trail.push({ ...startPosition });
    }

    update() {
        super.update();
        this.lifespan -= this.fadeRate;
        if (this.lifespan < 0) this.lifespan = 0;
        
        // Add current position to trail
        this.trail.push({ ...this.position });
        
        // Remove old trail points to maintain max length
        while (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    }

    draw(ctx) {
        if (this.lifespan > 0) {
            // Draw trail first (behind the particle)
            this.drawTrail(ctx);
            
            // Draw the main particle with enhanced visibility
            const alpha = this.lifespan;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.hslToRgb(this.colorHue, 100, 80);
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.strokeWidth * 1.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    drawTrail(ctx) {
        for (let i = 0; i < this.trail.length - 1; i++) {
            // Calculate alpha for this trail segment (older = more transparent)
            const trailAlpha = (i + 1) / this.trail.length; // 0.0 to 1.0
            const finalAlpha = trailAlpha * this.lifespan * 0.9;
            
            if (finalAlpha > 0.01) {
                // Calculate radius for this trail segment (older = smaller)
                const trailRadius = this.strokeWidth * trailAlpha * 1.2;
                
                ctx.save();
                ctx.globalAlpha = finalAlpha;
                ctx.fillStyle = this.hslToRgb(this.colorHue, 95, 60);
                ctx.beginPath();
                ctx.arc(this.trail[i].x, this.trail[i].y, Math.max(trailRadius, 0.8), 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }
}
