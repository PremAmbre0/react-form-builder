import React, { useState } from 'react';
import { getAccentColorHex } from '../../utils/colors';

export default function SliderInput({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;
    const currentValue = value !== undefined ? value : config.defaultValue;
    const [isHovering, setIsHovering] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const accentHex = getAccentColorHex(accentColor);

    return (
        <div className="flex flex-col mb-4">
            {/* Label and Hint Group */}
            <div className="mb-2">
                <div className="flex justify-between items-center">
                    <label htmlFor={field.id} className="block text-sm font-medium">
                        {config.label} {validation.required && <span className="text-destructive">*</span>}
                    </label>
                    {config.showLabels && !config.showTooltip && (
                        <span className="text-sm font-medium text-muted-foreground">{currentValue}</span>
                    )}
                </div>
                {config.helpText && <div className="text-xs text-muted-foreground">{config.helpText}</div>}
            </div>

            {/* Input and Error Group */}
            <div className="relative">
                <div
                    className="relative flex items-center gap-4"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {config.showLabels && <span className="text-xs text-muted-foreground">{validation.min}</span>}

                    <div className="relative w-full">
                        {/* Tooltip */}
                        {(config.showTooltip || config.persistentTooltip) && (
                            <div
                                className={`absolute -top-8 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded border border-border shadow-sm transition-opacity duration-200 ${config.persistentTooltip || isHovering || isDragging ? 'opacity-100' : 'opacity-0'
                                    }`}
                                style={{
                                    left: `${((currentValue - (validation.min || 0)) / ((validation.max || 100) - (validation.min || 0))) * 100}%`,
                                    backgroundColor: accentHex,
                                    color: '#ffffff'
                                }}
                            >
                                {currentValue}
                                <div
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                                    style={{ backgroundColor: accentHex }}
                                />
                            </div>
                        )}

                        <input
                            type="range"
                            id={field.id}
                            value={currentValue}
                            onChange={(e) => onChange(field.id, parseInt(e.target.value))}
                            onMouseDown={() => setIsDragging(true)}
                            onMouseUp={() => setIsDragging(false)}
                            onTouchStart={() => setIsDragging(true)}
                            onTouchEnd={() => setIsDragging(false)}
                            onBlur={() => {
                                setIsDragging(false);
                                onBlur(field.id);
                            }}
                            min={validation.min}
                            max={validation.max}
                            step={validation.step}
                            className={`w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer`}
                            style={{ accentColor: accentHex }}
                        />
                    </div>

                    {config.showLabels && <span className="text-xs text-muted-foreground">{validation.max}</span>}
                </div>
                {error && <span className="absolute top-full left-0 text-xs text-destructive">{error}</span>}
            </div>
        </div>
    );
}
