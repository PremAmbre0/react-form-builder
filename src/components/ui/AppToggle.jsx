import React from 'react';

const AppToggle = ({
    label,
    value,
    onChange,
    onLabel = 'On',
    offLabel = 'Off',
    toggleStyle = 'offset', // 'offset' or 'inset'
    error,
    required = false,
    disabled = false,
    className = '',
    helpText,
    accentColor = 'primary',
    accentColorHex
}) => {
    return (
        <div className={`flex flex-col ${className} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Label and Hint Group */}
            {(label || helpText) && (
                <div className="mb-2">
                    <div className="flex justify-between items-center">
                        {label && (
                            <label className="block text-sm font-medium break-words">
                                {label} {required && <span className="text-destructive">*</span>}
                            </label>
                        )}
                    </div>
                    {helpText && <div className="text-xs text-muted-foreground">{helpText}</div>}
                </div>
            )}

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    role="switch"
                    aria-checked={value}
                    onClick={() => !disabled && onChange(!value)}
                    disabled={disabled}
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <span
                        className={`
                            absolute left-0 top-1/2 -translate-y-1/2 w-full rounded-full transition-colors
                            ${toggleStyle === 'offset' ? 'h-3.5' : 'h-full'}
                            ${value ? (!accentColorHex ? `bg-${accentColor}` : '') : 'bg-input'}
                        `}
                        style={{
                            backgroundColor: value ? (accentColorHex || `var(--color-${accentColor})`) : undefined
                        }}
                    />
                    <span
                        className={`
                            pointer-events-none block h-5 w-5 rounded-full bg-background shadow-md border border-gray-200 ring-0 transition-transform relative z-10
                            ${value ? 'translate-x-[26px]' : 'translate-x-[-2px]'}
                            ${toggleStyle === 'inset' ? 'scale-75' : ''}
                        `}
                    />
                </button>
                <span className="text-sm font-medium">
                    {value ? onLabel : offLabel}
                </span>
            </div>

            {error && <span className="text-xs text-destructive mt-1">{error}</span>}
        </div>
    );
};

export default AppToggle;
