/**
 * Helper class providing methods for generating random floating-point numbers.
 */
class RandomFloat {
    /**
     * Generate a random float between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random float between min and max
     */
    static nextFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Generate a random unit vector (direction)
     * @returns {Object} Vector with x and y components
     */
    static nextVector() {
        const angle = RandomFloat.nextFloat(0, Math.PI * 2);
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    /**
     * Generate a random integer between min and max (inclusive)
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Random integer between min and max
     */
    static nextInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
