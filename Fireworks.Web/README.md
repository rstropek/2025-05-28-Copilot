# Fireworks Web

A web-based fireworks simulation using vanilla JavaScript, HTML5 Canvas, and CSS.

## Features

- **Interactive Fireworks**: Click anywhere on the canvas to launch a firework from that position
- **Automatic Launch**: Fireworks automatically launch every second (can be toggled)
- **Realistic Physics**: Rockets launch upward with gravity, explode at peak height
- **Particle Trails**: Both rockets and explosion particles have glowing trails
- **Random Colors**: Each firework has a random hue with slight variations in explosion particles
- **Control Panel**: Toggle auto-launch, clear screen, or trigger burst mode

## Files Structure

```
Fireworks.Web/
├── index.html          # Main HTML page with canvas and controls
├── fireworks.js        # Main application logic and game loop
├── rocket.js           # Rocket class with launching and explosion logic
├── particle.js         # Base particle class and explosion particle class
└── randomFloat.js      # Utility functions for random number generation
```

## How to Run

1. Open `index.html` in any modern web browser
2. The fireworks will start automatically
3. Click anywhere on the canvas to launch fireworks manually
4. Use the control buttons at the bottom:
   - **Toggle Auto-Launch**: Turn automatic firework launching on/off
   - **Clear Screen**: Remove all current fireworks
   - **Burst Mode**: Launch multiple fireworks in quick succession

## Technical Details

### Canvas Size
- Default: 800x600 pixels
- Responsive design that adapts to screen size

### Animation
- 60 FPS using `requestAnimationFrame`
- Smooth particle physics with gravity simulation

### Color System
- HSL color space for vibrant firework colors
- Each firework gets a random hue (0-360°)
- Explosion particles have slight hue variations for realistic effect

### Particle System
- **Rocket Phase**: Particles launch upward with trailing effect
- **Explosion Phase**: 30 particles spread in all directions with fading trails
- **Trail System**: Both rockets and explosion particles leave glowing trails

## Customization

You can easily customize the fireworks by modifying these parameters in the code:

### In `fireworks.js`:
- `autoLaunch` frequency (currently every 60 frames = 1 second)
- Canvas dimensions
- Rocket spawn position and velocity ranges

### In `rocket.js`:
- `particleCount` for explosion size (currently 30)
- Explosion velocity range
- Trail length (`maxRocketTrailLength`)

### In `particle.js`:
- `fadeRate` for particle lifespan
- `maxTrailLength` for trail effects
- Gravity strength in `Particle.gravity`

## Browser Compatibility

This fireworks simulation works in all modern browsers that support:
- HTML5 Canvas
- ES6 Classes
- requestAnimationFrame

Tested on Chrome, Firefox, Safari, and Edge.
