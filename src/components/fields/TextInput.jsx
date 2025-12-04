import React from 'react';
import { validateField } from '../../utils/validation';

export default function TextInput({ field, value, onChange, onBlur, error, accentColor, isLast, disabled }) {
    const { config, validation } = field;
    return (
        <div className={`space-y-2 relative ${isLast ? 'pb-5' : 'pb-0'} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex justify-between items-center">
                <label htmlFor={field.id} className="block text-sm font-medium">
                    {config.label} {validation.required && <span className="text-destructive">*</span>}
                </label>
                {error && <span className="text-xs text-destructive">{error}</span>}
            </div>
            {config.helpText && <p className="text-xs text-muted-foreground">{config.helpText}</p>}
            <input
                type={config.validationType === 'email' ? 'email' : config.validationType === 'website' ? 'url' : 'text'}
                inputMode={config.validationType === 'number' ? 'numeric' : undefined}
                pattern={config.validationType === 'number' ? '[0-9]*' : undefined}
                id={field.id}
                value={value || ''}
                onChange={(e) => onChange(field.id, e.target.value)}
                onBlur={() => onBlur(field.id)}
                placeholder={config.placeholder}
                disabled={disabled}
                className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none transition-colors ${error
                    ? 'border-destructive focus:border-destructive placeholder:text-destructive/60'
                    : `border-input focus:border-${accentColor} placeholder:text-${accentColor}/60`
                    }`}
            />
        </div>
    );
}
