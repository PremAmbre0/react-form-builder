import React from 'react';
import AppToggle from '../ui/AppToggle';
import { ACCENT_COLORS } from '../../constants/colors';

export default function ToggleInput({ field, value, onChange, onBlur, error, accentColor, isLast, disabled, hideLabel }) {
    const { config, validation } = field;
    const accentColorHex = ACCENT_COLORS.find(c => c.class === accentColor)?.value;

    return (
        <AppToggle
            label={hideLabel ? null : config.label}
            value={value}
            onChange={(val) => onChange(field.id, val)}
            onLabel={config.onLabel}
            offLabel={config.offLabel}
            toggleStyle={config.toggleStyle}
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
