import React from 'react';

export default function ToggleInput({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;
    const isChecked = !!value;

    return (
        <div className={`space-y-2 relative ${isLast ? 'pb-5' : 'pb-0'}`}>
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium">
                    {config.label} {validation.required && <span className="text-destructive">*</span>}
                </label>
                {error && <span className="text-xs text-destructive">{error}</span>}
            </div>
            {config.helpText && <p className="text-xs text-muted-foreground">{config.helpText}</p>}

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
                        <div
                            className={`w-20 h-8 bg-input peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-${accentColor}/20 rounded-full peer peer-checked:bg-${accentColor} relative transition-colors overflow-hidden flex items-center shadow-inner`}
                            style={isChecked ? { backgroundColor: `var(--${accentColor})` } : {}}
                        >
                            <div className={`absolute top-1 start-1 bg-white border border-gray-300 rounded-full h-6 w-6 transition-all z-10 ${isChecked ? 'translate-x-12 border-white' : 'translate-x-0'}`}></div>
                            <span className={`absolute left-2 text-[10px] font-bold text-white transition-opacity ${isChecked ? 'opacity-100' : 'opacity-0'}`}>
                                {config.onLabel || 'ON'}
                            </span>
                            <span className={`absolute right-2 text-[10px] font-bold text-muted-foreground transition-opacity ${isChecked ? 'opacity-0' : 'opacity-100'}`}>
                                {config.offLabel || 'OFF'}
                            </span>
                        </div>
                    ) : (
                        <div className={`w-11 h-6 bg-input peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-${accentColor}/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-${accentColor}`}
                            style={isChecked ? { backgroundColor: `var(--${accentColor})` } : {}}
                        ></div>
                    )}
                </label>
                {config.toggleStyle !== 'inset' && (
                    <span className="text-sm font-medium text-muted-foreground">
                        {isChecked ? (config.onLabel || 'On') : (config.offLabel || 'Off')}
                    </span>
                )}
            </div>
        </div>
    );
}
