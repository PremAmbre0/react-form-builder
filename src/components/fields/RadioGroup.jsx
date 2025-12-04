import React from 'react';

export default function RadioGroup({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;

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
                            type="radio"
                            id={`${field.id}-${index}`}
                            name={field.id}
                            value={option.value}
                            checked={value === option.value}
                            onChange={(e) => onChange(field.id, e.target.value)}
                            onBlur={() => onBlur(field.id)}
                            className={`h-4 w-4 border-input text-${accentColor} focus:ring-${accentColor}`}
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
                                type="radio"
                                id={`${field.id}-other`}
                                name={field.id}
                                value="other"
                                checked={value === 'other'}
                                onChange={(e) => onChange(field.id, e.target.value)}
                                onBlur={() => onBlur(field.id)}
                                className={`h-4 w-4 border-input text-${accentColor} focus:ring-${accentColor}`}
                                style={{ accentColor: `var(--${accentColor})` }}
                            />
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
        </div>
    );
}
