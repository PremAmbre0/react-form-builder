import React from 'react';
import AppRadioGroup from '../ui/AppRadioGroup';
import { ACCENT_COLORS } from '../../constants/colors';

export default function RadioGroup({ field, value, onChange, onBlur, error, accentColor, isLast, disabled, hideLabel }) {
    const { config, validation } = field;
    const accentColorHex = ACCENT_COLORS.find(c => c.class === accentColor)?.value;

    return (
        <AppRadioGroup
            label={hideLabel ? null : config.label}
            options={config.options}
            value={value}
            onChange={(val) => onChange(field.id, val)}
            allowOther={config.allowOther}
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
