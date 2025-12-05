import React from 'react';
import AppRating from '../ui/AppRating';

export default function RatingInput({ field, value, onChange, onBlur, error, accentColor, isLast, disabled, hideLabel }) {
    const { config, validation } = field;

    return (
        <AppRating
            label={hideLabel ? null : config.label}
            value={value}
            onChange={(val) => onChange(field.id, val)}
            maxStars={config.maxStars}
            starSize={config.starSize}
            customStarSize={config.customStarSize}
            error={error}
            required={validation.required}
            disabled={disabled}
            helpText={hideLabel ? null : config.helpText}
            accentColor={accentColor}
            className="mb-8"
        />
    );
}
