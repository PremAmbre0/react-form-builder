import React from 'react';

export default function PasswordInput({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;
    return (
        <div className="flex flex-col mb-4">
            {/* Label and Hint Group */}
            <div className="mb-2">
                <div className="flex justify-between items-center">
                    <label htmlFor={field.id} className="block text-sm font-medium">
                        {config.label} {validation.required && <span className="text-destructive">*</span>}
                    </label>
                </div>
                {config.helpText && <div className="text-xs text-muted-foreground">{config.helpText}</div>}
            </div>

            {/* Input and Error Group */}
            <div className="relative">
                <input
                    type="password"
                    id={field.id}
                    value={value || ''}
                    onChange={(e) => onChange(field.id, e.target.value)}
                    onBlur={() => onBlur(field.id)}
                    placeholder={config.placeholder}
                    className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none transition-colors ${error
                        ? 'border-destructive focus:border-destructive placeholder:text-destructive/60'
                        : `border-input focus:border-${accentColor} placeholder:text-${accentColor}/60`
                        }`}
                />
                {error && <span className="absolute top-full left-0 text-xs text-destructive">{error}</span>}
            </div>
        </div>
    );
}
