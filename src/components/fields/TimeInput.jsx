import React, { useState, useRef, useEffect } from 'react';
import CustomTimePicker from './CustomTimePicker';
import { Clock, X } from 'lucide-react';
import '../../assets/styles/CustomDatePicker.css';

export default function TimeInput({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;
    const [showPicker, setShowPicker] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Handle outside click to close picker
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is outside the container
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                // With portal, clicking the picker is "outside" containerRef.
                // But we added onMouseDown preventDefault on picker, so input stays focused.
                // We rely on onBlur to handle focus loss.
                // This useEffect is mainly for clicks on non-focusable elements outside.
                // But since we use onBlur, this might be redundant or conflicting.
                // Let's keep it simple: if we click outside and it's NOT the picker (which is in portal), close.
                // But we can't easily check picker ref here.
                // However, if we click outside, focus changes.
                // If we click the picker, focus stays on input (due to preventDefault).
                // So onBlur won't fire.
                // If we click background, focus might stay on input? No, usually body gets focus or nothing.

                // Let's just rely on onBlur for closing when focus leaves.
                // And maybe a global click listener that closes if not clicking input or picker?
                // But picker is hard to detect without ref.

                // Actually, the previous logic was fine because picker was inside container.
                // Now it's outside.

                // If I remove this useEffect, does onBlur handle everything?
                // If I click a blank area of the page, the input loses focus -> onBlur fires -> closes.
                // If I click another input, input loses focus -> onBlur fires -> closes.
                // If I click the picker, preventDefault stops focus loss -> input keeps focus -> onBlur DOES NOT fire -> stays open.
                // This seems perfect.

                // So I can probably remove this useEffect entirely?
                // Let's comment it out for now to test the onBlur-only approach.
                // setShowPicker(false);
                // onBlur(field.id);
            }
        };

        // if (showPicker) {
        //     document.addEventListener('mousedown', handleClickOutside);
        // }

        // return () => {
        //     document.removeEventListener('mousedown', handleClickOutside);
        // };
    }, [showPicker, onBlur, field.id]);

    const handleTimeChange = (isoString) => {
        onChange(field.id, isoString);
    };

    // Convert ISO string to HH:mm AM/PM for input display
    const getDisplayValue = () => {
        if (!value) return '';
        try {
            const date = new Date(value);
            if (isNaN(date.getTime())) return '';
            const is24Hour = config.timeFormat === '24';
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: !is24Hour });
        } catch (e) {
            return '';
        }
    };

    const handleBlur = (e) => {
        // Only close and trigger blur if focus moves outside the container
        // With portal, the picker is outside container.
        // But clicking picker doesn't trigger blur.
        // So if blur happens, it means we clicked something else.
        setShowPicker(false);
        onBlur(field.id);
    };

    return (
        <div className="flex flex-col mb-4" ref={containerRef}>
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
            <div className={`relative ${showPicker ? 'z-20' : ''}`}>
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        id={field.id}
                        value={getDisplayValue()}
                        readOnly
                        onClick={() => setShowPicker(!showPicker)}
                        onFocus={() => setShowPicker(true)}
                        onBlur={handleBlur}
                        placeholder="Select time"
                        className={`w-full px-3 py-2 pl-10 ${value ? 'pr-8' : ''} border rounded-md bg-background text-sm focus:outline-none transition-colors cursor-pointer ${error
                            ? 'border-destructive focus:border-destructive'
                            : `border-input focus:border-[var(--color-primary)]`
                            }`}
                        style={showPicker ? { borderColor: `var(--color-primary)` } : {}}
                    />
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    {value && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(field.id, '');
                            }}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground z-10"
                        >
                            <X size={16} />
                        </button>
                    )}

                    {showPicker && (
                        <CustomTimePicker
                            value={value}
                            onChange={handleTimeChange}
                            onClose={() => setShowPicker(false)}
                            accentColor={accentColor}
                            format={config.timeFormat || '24'}
                            triggerRef={inputRef}
                        />
                    )}
                </div>
                {error && <span className="absolute top-full left-0 text-xs text-destructive">{error}</span>}
            </div>
        </div>
    );
}
