
/**
 * Converts a hex color to RGB object
 * @param {string} hex 
 * @returns {{r: number, g: number, b: number} | null}
 */
export const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * Darkens a color by a percentage
 * @param {string} hex 
 * @param {number} percent (0-100)
 * @returns {string}
 */
export const darken = (hex, percent) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const amount = Math.floor(255 * (percent / 100));

    const r = Math.max(0, rgb.r - amount);
    const g = Math.max(0, rgb.g - amount);
    const b = Math.max(0, rgb.b - amount);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Lightens a color by a percentage
 * @param {string} hex 
 * @param {number} percent (0-100)
 * @returns {string}
 */
export const lighten = (hex, percent) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const amount = Math.floor(255 * (percent / 100));

    const r = Math.min(255, rgb.r + amount);
    const g = Math.min(255, rgb.g + amount);
    const b = Math.min(255, rgb.b + amount);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Generates a color palette from a base hex color
 * @param {string} baseColor 
 * @returns {Object} CSS variables object
 */
export const generatePalette = (baseColor) => {
    // Ensure we have a valid hex
    const hex = baseColor.startsWith('#') ? baseColor : '#4f46e5'; // Default to indigo-600 if invalid

    return {
        '--color-primary': hex,
        '--color-primary-hover': darken(hex, 10),
        '--color-primary-active': darken(hex, 20),
        '--color-primary-subtle': lighten(hex, 40), // Very light tint for backgrounds
        '--color-primary-light': lighten(hex, 30),
        '--color-primary-rgb': (() => {
            const rgb = hexToRgb(hex);
            return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '79, 70, 229';
        })(),
    };
};
