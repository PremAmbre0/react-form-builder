import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function DropdownInput({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;
    const isMulti = config.multiSelect;
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const options = [...(config.options || [])];
    if (config.allowOther) {
        options.push({ label: 'Other', value: 'other' });
    }

    const selectedValues = isMulti
        ? (Array.isArray(value) ? value : [])
        : [value];

    const isOtherSelected = isMulti
        ? selectedValues.includes('other')
        : value === 'other';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMultiChange = (optionValue) => {
        let newValues;
        if (selectedValues.includes(optionValue)) {
            newValues = selectedValues.filter(v => v !== optionValue);
        } else {
            newValues = [...selectedValues, optionValue];
        }
        onChange(field.id, newValues);
    };

    const getDisplayLabel = () => {
        if (!selectedValues.length) return 'Select options...';
        if (selectedValues.length === 1) {
            const option = options.find(o => o.value === selectedValues[0]);
            return option ? option.label : selectedValues[0];
        }
        return `${selectedValues.length} options selected`;
    };

    return (
        <div className={`space-y-2 relative ${isLast ? 'pb-5' : 'pb-0'}`} ref={containerRef}>
            <div className="flex justify-between items-center">
                <label htmlFor={field.id} className="block text-sm font-medium">
                    {config.label} {validation.required && <span className="text-destructive">*</span>}
                </label>
                {error && <span className="text-xs text-destructive">{error}</span>}
            </div>
            {config.helpText && <p className="text-xs text-muted-foreground">{config.helpText}</p>}

            {isMulti ? (
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        onBlur={() => {
                            // Delay hiding to allow click events on options to fire
                            // Actually handled by click outside ref, so this might not be needed or could conflict.
                            // We'll rely on click outside for closing.
                            onBlur(field.id);
                        }}
                        className={`w-full px-3 py-2 border rounded-md bg-background text-sm flex items-center justify-between focus:outline-none transition-colors ${error
                            ? 'border-destructive focus:border-destructive'
                            : `border-input focus:border-${accentColor}`
                            }`}
                    >
                        <span className={selectedValues.length ? 'text-foreground' : 'text-muted-foreground'}>
                            {getDisplayLabel()}
                        </span>
                        <ChevronDown size={16} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                            {options.map((option, index) => {
                                const isSelected = selectedValues.includes(option.value);
                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleMultiChange(option.value)}
                                        className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-accent hover:text-accent-foreground ${isSelected ? 'bg-accent/50' : ''}`}
                                    >
                                        <span>{option.label}</span>
                                        {isSelected && <Check size={14} className={`text-${accentColor}`} style={{ color: `var(--${accentColor})` }} />}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative">
                    <select
                        id={field.id}
                        value={value || ''}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        onBlur={() => onBlur(field.id)}
                        className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none transition-colors appearance-none ${error
                            ? 'border-destructive focus:border-destructive'
                            : `border-input focus:border-${accentColor}`
                            }`}
                    >
                        <option value="" disabled>Select an option</option>
                        {options.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
            )}

            {isOtherSelected && (
                <input
                    type="text"
                    placeholder="Please specify"
                    className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none transition-colors ${`border-input focus:border-${accentColor}`
                        }`}
                // Note: We are not binding this to the main value yet to avoid breaking the select selection.
                // In a real app, we might store this in a separate field or composite value.
                />
            )}
        </div>
    );
}
