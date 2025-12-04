import React from 'react';

export default function CheckboxGroup({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;
    const selectedValues = Array.isArray(value) ? value : [];

    const handleCheckboxChange = (optionValue, checked) => {
        let newValues;
        if (config.multiSelect === false) {
            // Single selection mode
            if (checked) {
                newValues = [optionValue];
            } else {
                newValues = [];
            }
        } else {
            // Multi selection mode (default)
            if (checked) {
                newValues = [...selectedValues, optionValue];
            } else {
                newValues = selectedValues.filter(v => v !== optionValue);
            }
        }
        onChange(field.id, newValues);
    };

    return (
        <div className={`space-y-2 relative ${isLast ? 'pb-5' : 'pb-0'}`}>
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium">
                    {config.label} {validation.required && <span className="text-destructive">*</span>}
                </label>
                {error && <span className="text-xs text-destructive">{error}</span>}
            </div>
            {config.helpText && <p className="text-xs text-muted-foreground">{config.helpText}</p>}

            <div className="space-y-2">
                {config.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={`${field.id}-${index}`}
                            checked={selectedValues.includes(option.value)}
                            onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                            onBlur={() => onBlur(field.id)}
                            className={`h-4 w-4 rounded border-input text-${accentColor} focus:ring-${accentColor}`}
                            style={{ accentColor: `var(--${accentColor})` }}
                        />
                        <label htmlFor={`${field.id}-${index}`} className="text-sm cursor-pointer select-none">
                            {option.label}
                        </label>
                    </div>
                ))}
                {config.allowOther && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`${field.id}-other`}
                                checked={selectedValues.includes('other')}
                                onChange={(e) => handleCheckboxChange('other', e.target.checked)}
                                onBlur={() => onBlur(field.id)}
                                className={`h-4 w-4 rounded border-input text-${accentColor} focus:ring-${accentColor}`}
                                style={{ accentColor: `var(--${accentColor})` }}
                            />
                            <label htmlFor={`${field.id}-other`} className="text-sm cursor-pointer select-none">
                                Other
                            </label>
                        </div>
                        {selectedValues.includes('other') && (
                            <input
                                type="text"
                                placeholder="Please specify"
                                className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none transition-colors border-input focus:border-${accentColor}`}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
