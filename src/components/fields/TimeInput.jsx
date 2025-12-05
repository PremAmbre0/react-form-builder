import React, { useRef, useState, useEffect } from 'react';
import { Clock, X } from 'lucide-react';
import AppTimePicker from '../ui/AppTimePicker';
import '../../assets/styles/CustomDatePicker.css';

export default function TimeInput({ field, value, onChange, onBlur, error, accentColor, isLast, hideLabel }) {
    const { config, validation } = field;
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    const handleClear = (e) => {
        e.stopPropagation();
        onChange(field.id, '');
    };

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsPickerOpen(false);
            }
        };

        if (isPickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPickerOpen]);

    // Format display value
    const getDisplayValue = () => {
        if (!value) return '';
        const date = new Date(value);
        if (isNaN(date.getTime())) return '';

        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');

        if (config.timeFormat === '24') {
            return `${hours.toString().padStart(2, '0')}:${minutes}`;
        } else {
            const period = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${hours}:${minutes} ${period}`;
        }
    };

    return (
        <div className="flex flex-col mb-8" ref={containerRef}>
            {/* Label and Hint Group */}
            {!hideLabel && (
                <div className="mb-2">
                    <div className="flex justify-between items-center">
                        <label htmlFor={field.id} className="block text-sm font-medium">
                            {config.label} {validation.required && <span className="text-destructive">*</span>}
                        </label>
                    </div>
                    {config.helpText && <div className="text-xs text-muted-foreground">{config.helpText}</div>}
                </div>
            )}

            {/* Input and Error Group */}
            <div className="relative">
                <div
                    className="relative cursor-pointer"
                    onClick={() => !field.disabled && setIsPickerOpen(!isPickerOpen)}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        id={field.id}
                        value={getDisplayValue()}
                        readOnly
                        placeholder={config.placeholder || (config.timeFormat === '24' ? '14:30' : '02:30 PM')}
                        disabled={field.disabled}
                        className={`w-full px-3 py-2 pl-10 ${value ? 'pr-8' : ''} border rounded-md bg-background text-sm focus:outline-none transition-colors cursor-pointer ${error
                            ? 'border-destructive focus:border-destructive placeholder:text-destructive/60'
                            : `border-input focus:border-${accentColor} placeholder:text-${accentColor}/60`
                            } ${isPickerOpen ? `border-${accentColor} ring-1 ring-${accentColor}/20` : ''}`}
                    />
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />

                    {value && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors z-10"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {isPickerOpen && (
                    <AppTimePicker
                        value={value}
                        onChange={(val) => {
                            onChange(field.id, val);
                            // Keep open for better UX or close? Usually keep open until click outside or done.
                            // But for this picker, maybe we keep it open.
                        }}
                        onClose={() => setIsPickerOpen(false)}
                        accentColor={accentColor}
                        format={config.timeFormat}
                        triggerRef={inputRef}
                    />
                )}

                {error && <span className="absolute top-full left-0 text-xs text-destructive">{error}</span>}
            </div>
        </div>
    );
}
