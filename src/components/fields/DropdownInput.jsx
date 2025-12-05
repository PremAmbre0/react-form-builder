import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';

export default function DropdownInput({ field, value, onChange, onBlur, error, accentColor, isLast, hideLabel }) {
    const { config, validation } = field;
    const isMulti = config.multiSelect;
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const options = [...(config.options || [])];
    if (config.allowOther) {
        options.push({ label: 'Other', value: 'other' });
    }

    // Helper to normalize value to array for easier handling
    const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);

    const isOtherSelected = selectedValues.includes('other');

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
                onBlur(field.id);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onBlur, field.id]);

    const handleSelect = (optionValue) => {
        let newValues;
        if (isMulti) {
            if (selectedValues.includes(optionValue)) {
                newValues = selectedValues.filter(v => v !== optionValue);
            } else {
                newValues = [...selectedValues, optionValue];
            }
        } else {
            // Single select: toggle off if same, or set new
            // Usually single select just sets the value.
            newValues = [optionValue];
            setIsOpen(false); // Close on selection for single select
        }

        // Pass back appropriate format (array for multi, string for single)
        onChange(field.id, isMulti ? newValues : newValues[0]);
    };

    const getDisplayLabel = () => {
        if (!selectedValues.length) return 'Select option...';

        if (isMulti) {
            if (selectedValues.length === 1) {
                const option = options.find(o => o.value === selectedValues[0]);
                return option ? option.label : selectedValues[0];
            }
            return `${selectedValues.length} options selected`;
        } else {
            const option = options.find(o => o.value === selectedValues[0]);
            return option ? option.label : selectedValues[0];
        }
    };

    return (
        <div className="flex flex-col mb-8" ref={containerRef}>
            {/* Label and Hint Group */}
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

            {/* Input and Error Group */}
            <div className="relative">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full px-3 py-2 border rounded-md bg-background text-sm flex items-center justify-between focus:outline-none transition-colors ${error
                            ? 'border-destructive focus:border-destructive'
                            : `border-input focus:border-${accentColor}`
                            }`}
                        style={isOpen ? { borderColor: `var(--${accentColor})` } : {}}
                    >
                        <div className="flex items-center gap-2 overflow-hidden">
                            <span className={`truncate ${selectedValues.length ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {getDisplayLabel()}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                            {selectedValues.length > 0 && (
                                <div
                                    role="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(field.id, isMulti ? [] : '');
                                    }}
                                    className="text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted transition-colors"
                                >
                                    <X size={14} />
                                </div>
                            )}
                            <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                            {options.map((option, index) => {
                                const isSelected = selectedValues.includes(option.value);
                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleSelect(option.value)}
                                        className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent/10 font-medium' : ''}`}
                                        style={isSelected ? { color: `var(--${accentColor})` } : {}}
                                    >
                                        <span>{option.label}</span>
                                        {isSelected && <Check size={14} style={{ color: `var(--${accentColor})` }} />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {error && <span className="absolute top-full left-0 text-xs text-destructive">{error}</span>}
            </div>

            {isOtherSelected && (
                <div className="mt-2">
                    <input
                        type="text"
                        placeholder="Please specify"
                        className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none transition-colors ${`border-input focus:border-${accentColor}`
                            }`}
                        style={{ borderColor: `var(--${accentColor})` }}
                    />
                </div>
            )}
        </div>
    );
}
