/**
 * Main Fireworks application
 */
class FireworksApp {
    constructor() {
        this.canvas = document.getElementById('fireworksCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.rockets = [];
        this.frameCount = 0;
        this.autoLaunch = true;
        this.isRunning = false;
        
        this.setupEventListeners();
        this.setupControls();
        this.start();
    }

    setupEventListeners() {
        // Click to launch firework
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.createRocketAt(x);
        });

        // Resize canvas if window resizes
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }

    setupControls() {
        const toggleAutoBtn = document.getElementById('toggleAutoBtn');
        const clearBtn = document.getElementById('clearBtn');
        const burstBtn = document.getElementById('burstBtn');
        const autoStatus = document.getElementById('autoStatus');

        toggleAutoBtn.addEventListener('click', () => {
            this.autoLaunch = !this.autoLaunch;
            autoStatus.textContent = this.autoLaunch ? 'ON' : 'OFF';
        });

        clearBtn.addEventListener('click', () => {
            this.rockets = [];
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        });

        burstBtn.addEventListener('click', () => {
            // Launch multiple rockets at once
            const burstCount = RandomFloat.nextInt(5, 10);
            for (let i = 0; i < burstCount; i++) {
                setTimeout(() => {
                    const x = RandomFloat.nextFloat(100, this.canvas.width - 100);
                    this.createRocketAt(x);
                }, i * 200); // Stagger the launches slightly
            }
        });
    }

    resizeCanvas() {
        // Keep the canvas at a reasonable size
        const maxWidth = Math.min(window.innerWidth - 40, 1200);
        const maxHeight = Math.min(window.innerHeight - 100, 800);
        
        this.canvas.width = maxWidth;
        this.canvas.height = maxHeight;
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.gameLoop();
    }

    stop() {
        this.isRunning = false;
    }

    gameLoop() {
        if (!this.isRunning) return;

        this.update();
        this.draw();

        // Use requestAnimationFrame for smooth 60 FPS
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.frameCount++;
        
        // Create a new rocket every 1 second (60 frames at 60 FPS) if auto-launch is enabled
        if (this.autoLaunch && this.frameCount % 60 === 0) {
            this.createRocket();
        }
        
        // Update all rockets
        this.rockets.forEach(rocket => rocket.update());
        
        // Remove completed rockets
        this.rockets = this.rockets.filter(rocket => !rocket.isCompletelyDone);
    }

    draw() {
        // Clear canvas with black background
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all rockets
        this.rockets.forEach(rocket => rocket.draw(this.ctx));
    }

    createRocket() {
        const startX = RandomFloat.nextFloat(100, this.canvas.width - 100);
        this.createRocketAt(startX);
    }

    createRocketAt(x) {
        const startY = this.canvas.height - 50; // Start near bottom
        const startPosition = { x: x, y: startY };
        
        // Launch upward with some random variation
        const launchVelocity = { 
            x: RandomFloat.nextFloat(-1, 1), // Small horizontal variation
            y: RandomFloat.nextFloat(-12, -8) // Launch upward
        };
        
        const hue = RandomFloat.nextFloat(0, 360); // Random color
        
        const rocket = new Rocket(hue, startPosition, launchVelocity, 3.0);
        this.rockets.push(rocket);
    }
}

// Start the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FireworksApp();
});
