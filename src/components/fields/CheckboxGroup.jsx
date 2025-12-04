import React from 'react';
import { getAccentColorHex } from '../../utils/colors';

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
        <div className="flex flex-col mb-4">
            {/* Label and Hint Group */}
            <div className="mb-2">
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium">
                        {config.label} {validation.required && <span className="text-destructive">*</span>}
                    </label>
                </div>
                {config.helpText && <div className="text-xs text-muted-foreground">{config.helpText}</div>}
            </div>

            {/* Input and Error Group */}
            <div className="relative">
                <div className="space-y-2">
                    {config.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id={`${field.id}-${index}`}
                                checked={selectedValues.includes(option.value)}
                                onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                                onBlur={() => onBlur(field.id)}
                                className="sr-only peer"
                            />
                            <div className={`h-4 w-4 shrink-0 rounded border border-input ring-offset-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)] transition-colors flex items-center justify-center text-white`}>
                                {selectedValues.includes(option.value) && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
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
                                    className="sr-only peer"
                                />
                                <div className={`h-4 w-4 shrink-0 rounded border border-input ring-offset-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-checked:bg-[var(--color-primary)] peer-checked:border-[var(--color-primary)] transition-colors flex items-center justify-center text-white`}>
                                    {selectedValues.includes('other') && (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </div>
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
                {error && <span className="absolute top-full left-0 text-xs text-destructive">{error}</span>}
            </div>
        </div>
    );
}
