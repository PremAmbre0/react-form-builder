import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function ColorPickerInput({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;
    return (
        <div className="flex flex-col mb-4">
            <div className="mb-2">
                <div className="flex justify-between items-center">
                    <label htmlFor={field.id} className="block text-sm font-medium">
                        {config.label} {validation.required && <span className="text-destructive">*</span>}
                    </label>
                </div>
                {config.helpText && <div className="text-xs text-muted-foreground">{config.helpText}</div>}
            </div>

            <div className="relative">
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        id={field.id}
                        value={value || config.defaultValue || '#000000'}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        onBlur={() => onBlur(field.id)}
                        className="h-10 w-20 p-1 border rounded cursor-pointer bg-background"
                    />
                    <span className="text-sm font-mono text-muted-foreground uppercase">
                        {value || config.defaultValue || '#000000'}
                    </span>
                    <button
                        type="button"
                        onClick={() => onChange(field.id, config.defaultValue || '#000000')}
                        className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                        title="Reset to default"
                    >
                        <RotateCcw size={14} />
                    </button>
                </div>
                {error && <span className="absolute top-full left-0 text-xs text-destructive">{error}</span>}
            </div>
        </div>
    );
}
