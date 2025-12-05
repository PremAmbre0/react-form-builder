import React from 'react';
import AppTextInput from '../ui/AppTextInput';

export default function TextInput({ field, value, onChange, onBlur, error, accentColor, isLast, disabled, hideLabel }) {
    const { config, validation } = field;

    const handleClear = () => {
        onChange(field.id, '');
    };

    return (
        <AppTextInput
            label={hideLabel ? null : config.label}
            value={value}
            onChange={(e) => onChange(field.id, e.target.value)}
            onBlur={() => onBlur(field.id)}
            placeholder={config.placeholder}
            error={error}
            required={validation.required}
            disabled={disabled}
            type={config.validationType === 'email' ? 'email' : config.validationType === 'website' ? 'url' : 'text'}
            inputMode={config.validationType === 'number' ? 'numeric' : undefined}
            pattern={config.validationType === 'number' ? '[0-9]*' : undefined}
            onClear={handleClear}
            helpText={hideLabel ? null : config.helpText}
            accentColor={accentColor}
            className="mb-8"
            id={field.id}
        />
    );
}
