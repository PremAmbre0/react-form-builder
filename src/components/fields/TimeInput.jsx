import React, { useState, useRef, useEffect } from 'react';
import CustomTimePicker from './CustomTimePicker';
import { Clock } from 'lucide-react';
import '../../assets/styles/CustomDatePicker.css';

export default function TimeInput({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;
    const [showPicker, setShowPicker] = useState(false);
    const containerRef = useRef(null);

    // Handle outside click to close picker
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowPicker(false);
                onBlur(field.id);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onBlur, field.id]);

    const handleTimeChange = (isoString) => {
        onChange(field.id, isoString);
    };

    // Convert ISO string to HH:mm AM/PM for input display
    const getDisplayValue = () => {
        if (!value) return '';
        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) return '';
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        } catch (e) {
            return '';
        }
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

            <div className="relative">
                <input
                    type="text"
                    id={field.id}
                    value={getDisplayValue()}
                    readOnly
                    onClick={() => setShowPicker(!showPicker)}
                    onFocus={() => setShowPicker(true)}
                    placeholder="Select time"
                    className={`w-full px-3 py-2 pl-10 border rounded-md bg-background text-sm focus:outline-none transition-colors cursor-pointer ${error
                        ? 'border-destructive focus:border-destructive'
                        : `border-input focus:border-${accentColor}`
                        }`}
                    style={showPicker ? { borderColor: `var(--${accentColor})` } : {}}
                />
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                {showPicker && (
                    <CustomTimePicker
                        value={value}
                        onChange={handleTimeChange}
                        onClose={() => setShowPicker(false)}
                        accentColor={accentColor}
                    />
                )}
            </div>
        </div>
    );
}
