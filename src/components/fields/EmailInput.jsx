import React from 'react';
import { X } from 'lucide-react';

export default function EmailInput({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;

    const handleClear = () => {
        onChange(field.id, '');
    };

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
                    {value && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors z-10"
                            tabIndex={-1}
                        >
                            <X size={14} />
                        </button>
                    )}

                    <input
                        type="email"
                        id={field.id}
                        value={value || ''}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        onBlur={() => onBlur(field.id)}
                        placeholder={config.placeholder}
                        className={`w-full px-3 py-2 ${value ? 'pr-8' : ''} border rounded-md bg-background text-sm focus:outline-none transition-colors ${error
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
