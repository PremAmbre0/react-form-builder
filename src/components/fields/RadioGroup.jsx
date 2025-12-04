import React from 'react';
import { getAccentColorHex } from '../../utils/colors';

export default function RadioGroup({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;

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
                                type="radio"
                                id={`${field.id}-${index}`}
                                name={field.id}
                                value={option.value}
                                checked={value === option.value}
                                onChange={(e) => onChange(field.id, e.target.value)}
                                onBlur={() => onBlur(field.id)}
                                className="sr-only peer"
                            />
                            <div className={`h-4 w-4 shrink-0 rounded-full border border-input ring-offset-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-checked:border-[var(--color-primary)] transition-colors flex items-center justify-center`}>
                                {value === option.value && (
                                    <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
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
                                    type="radio"
                                    id={`${field.id}-other`}
                                    name={field.id}
                                    value="other"
                                    checked={value === 'other'}
                                    onChange={(e) => onChange(field.id, e.target.value)}
                                    onBlur={() => onBlur(field.id)}
                                    className="sr-only peer"
                                />
                                <div className={`h-4 w-4 shrink-0 rounded-full border border-input ring-offset-background peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-checked:border-[var(--color-primary)] transition-colors flex items-center justify-center`}>
                                    {value === 'other' && (
                                        <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                                    )}
                                </div>
                                <label htmlFor={`${field.id}-other`} className="text-sm cursor-pointer select-none">
                                    Other
                                </label>
                            </div>
                            {value === 'other' && (
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
