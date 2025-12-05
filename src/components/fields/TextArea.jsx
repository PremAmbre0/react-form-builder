import React from 'react';

export default function TextArea({ field, value, onChange, onBlur, error, accentColor, isLast, disabled, hideLabel }) {
    const { config, validation } = field;

    return (
        <div className="flex flex-col mb-8">
            {!hideLabel && (
                <div className="mb-2">
                    <div className="flex justify-between items-center">
                        <label htmlFor={field.id} className="block text-sm font-medium break-words">
                            {config.label} {validation.required && <span className="text-destructive">*</span>}
                        </label>
                    </div>
                    {config.helpText && <div className="text-xs text-muted-foreground">{config.helpText}</div>}
                </div>
            )}
            <textarea
                id={field.id}
                value={value}
                onChange={(e) => onChange(field.id, e.target.value)}
                onBlur={() => onBlur(field.id)}
                placeholder={config.placeholder}
                disabled={disabled}
                className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-destructive' : 'border-input'}`}
                style={{ borderColor: error ? undefined : undefined }} // TODO: Add accent color support if needed
            />
            {error && <span className="text-xs text-destructive mt-1">{error}</span>}
        </div>
    );
}
