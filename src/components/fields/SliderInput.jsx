import React from 'react';
import AppSlider from '../ui/AppSlider';
import { ACCENT_COLORS } from '../../constants/colors';

export default function SliderInput({ field, value, onChange, onBlur, error, accentColor, isLast, disabled, hideLabel }) {
    const { config, validation } = field;
    const accentColorHex = ACCENT_COLORS.find(c => c.class === accentColor)?.value;

    return (
        <AppSlider
            label={hideLabel ? null : config.label}
            value={value}
            onChange={(val) => onChange(field.id, val)}
            min={validation.min}
            max={validation.max}
            step={config.step}
            showTooltip={config.showTooltip}
            error={error}
            required={validation.required}
            disabled={disabled}
            helpText={hideLabel ? null : config.helpText}
            accentColor={accentColor}
            accentColorHex={accentColorHex}
            className="mb-8"
        />
    );
}
