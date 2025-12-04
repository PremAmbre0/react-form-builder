import React, { useEffect } from 'react';
import useFormStore from '../store/useFormStore';
import { generatePalette, hexToRgb } from '../utils/colorGenerator';
import { getAccentColorHex } from '../utils/colors';

export default function ThemeProvider({ children }) {
    const activeForm = useFormStore(state => state.activeForm);

    useEffect(() => {
        if (!activeForm) return;

        const accentColorName = activeForm.accentColor || 'indigo-600';
        const hex = getAccentColorHex(accentColorName);
        const palette = generatePalette(hex);

        const root = document.documentElement;

        Object.entries(palette).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

    }, [activeForm?.accentColor]);

    return <>{children}</>;
}
