import React from 'react';

export default function ToggleInput({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;
    const isChecked = !!value;

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
                <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isChecked}
                            onChange={(e) => onChange(field.id, e.target.checked)}
                            onBlur={() => onBlur(field.id)}
                        />
                        {config.toggleStyle === 'inset' ? (
                            // Inset Style (iOS-like): Knob inside the track
                            <div
                                className={`w-11 h-6 bg-input peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm`}
                                style={{
                                    backgroundColor: isChecked ? 'var(--color-primary)' : undefined,
                                    '--tw-ring-color': 'var(--color-primary)',
                                    '--tw-ring-offset-width': '2px',
                                }}
                            ></div>
                        ) : (
                            // Outset Style (Material-like): Knob overflows the track
                            <div className="relative flex items-center">
                                {/* Track */}
                                <div
                                    className={`w-9 h-4 rounded-full transition-colors`}
                                    style={{
                                        backgroundColor: isChecked ? 'var(--color-primary-subtle)' : 'hsl(var(--input))',
                                    }}
                                ></div>
                                {/* Knob */}
                                <div
                                    className={`absolute left-0 rounded-full h-6 w-6 transition-all shadow-md bg-white flex items-center justify-center peer-focus:ring-2 peer-focus:ring-offset-2`}
                                    style={{
                                        transform: isChecked ? 'translateX(100%)' : 'translateX(-20%)',
                                        backgroundColor: isChecked ? 'var(--color-primary)' : 'white',
                                        '--tw-ring-color': 'var(--color-primary)',
                                        '--tw-ring-offset-width': '2px',
                                    }}
                                ></div>
                            </div>
                        )}
                    </label>
                    {config.toggleStyle !== 'inset' && (
                        <span className="text-sm font-medium text-muted-foreground">
                            {isChecked ? (config.onLabel || 'On') : (config.offLabel || 'Off')}
                        </span>
                    )}
                </div>
                {error && <span className="absolute top-full left-0 text-xs text-destructive">{error}</span>}
            </div>
        </div>
    );
}
