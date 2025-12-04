export const ACCENT_COLORS = {
    'indigo-600': '#4f46e5',
    'emerald-500': '#10b981',
    'rose-500': '#f43f5e',
    'amber-500': '#f59e0b',
    'slate-600': '#475569',
};

export const getAccentColorHex = (colorName) => {
    if (!colorName) return '#4f46e5';
    if (colorName.startsWith('#')) return colorName;
    return ACCENT_COLORS[colorName] || '#4f46e5'; // Default to indigo-600 if not found
};
