import React from 'react';

export default function CurrencyInput({ field, value, onChange, onBlur, error, accentColor, isLast }) {
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
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-muted-foreground sm:text-sm">{config.currencySymbol || '$'}</span>
                    </div>
                    <input
                        type="number"
                        id={field.id}
                        value={value || ''}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        onBlur={() => onBlur(field.id)}
                        placeholder={config.placeholder}
                        min={validation.min}
                        max={validation.max}
                        step="0.01"
                        className={`w-full pl-7 pr-3 py-2 border rounded-md bg-background text-sm focus:outline-none transition-colors ${error
                            ? 'border-destructive focus:border-destructive placeholder:text-destructive/60'
                            : `border-input focus:border-${accentColor} placeholder:text-${accentColor}/60`
                            }`}
                    />
                </div>
                {error && <span className="absolute top-full left-0 text-xs text-destructive">{error}</span>}
            </div>
        </div>
    );
}
