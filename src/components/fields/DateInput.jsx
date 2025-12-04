import React, { forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from 'lucide-react';
import '../../assets/styles/CustomDatePicker.css';
import { getAccentColorHex } from '../../utils/colors';

export default function DateInput({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;
    const [portalContainer, setPortalContainer] = useState(null);
    const accentHex = getAccentColorHex(accentColor);

    const handleChange = (date) => {
        if (date) {
            // Save as ISO string
            onChange(field.id, date.toISOString());
        } else {
            onChange(field.id, '');
        }
    };

    return (
        <div className={`space-y-2 relative ${isLast ? 'pb-5' : 'pb-0'}`}>
            <div className="flex justify-between items-center">
                <label htmlFor={field.id} className="block text-sm font-medium">
                    {config.label} {validation.required && <span className="text-destructive">*</span>}
                </label>
                {error && <span className="text-xs text-destructive">{error}</span>}
            </div>
            {config.helpText && <p className="text-xs text-muted-foreground">{config.helpText}</p>}

            <div
                className="relative date-picker-wrapper"
                style={{ '--accent-color': accentHex }}
                ref={setPortalContainer}
            >
                <DatePicker
                    selected={value ? new Date(value) : null}
                    onChange={handleChange}
                    onBlur={() => onBlur(field.id)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select date"
                    className={`w-full px-3 py-2 pl-10 border rounded-md bg-background text-sm focus:outline-none transition-colors cursor-pointer ${error
                        ? 'border-destructive focus:border-destructive'
                        : `border-input focus:border-${accentColor}`
                        }`}
                    wrapperClassName="w-full"
                    showPopperArrow={false}
                    popperPlacement="bottom-start"
                    calendarClassName="shadow-lg border border-border"
                    readOnly={false}
                    onFocus={(e) => e.target.readOnly = true}
                    portalContainer={portalContainer}
                />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
            </div>
        </div>
    );
}
