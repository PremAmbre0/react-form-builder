import React, { forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, X } from 'lucide-react';
import '../../assets/styles/CustomDatePicker.css';
import { getAccentColorHex } from '../../utils/colors';

export default function DateInput({ field, value, onChange, onBlur, error, accentColor, isLast, hideLabel }) {
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
        <div className="flex flex-col mb-8">
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
                    className="relative date-picker-wrapper"
                    style={{ '--accent-color': accentHex }}
                    ref={setPortalContainer}
                >
                    <DatePicker
                        selected={value ? new Date(value) : null}
                        onChange={handleChange}
                        onBlur={() => onBlur(field.id)}
                        dateFormat={config.dateFormat === 'MM/DD/YYYY' ? 'MM/dd/yyyy' : config.dateFormat === 'DD/MM/YYYY' ? 'dd/MM/yyyy' : 'yyyy-MM-dd'}
                        placeholderText="Select date"
                        minDate={validation.minDate ? new Date(validation.minDate) : null}
                        maxDate={validation.maxDate ? new Date(validation.maxDate) : null}
                        className={`w-full px-3 py-2 pl-10 ${value ? 'pr-8' : ''} border rounded-md bg-background text-sm focus:outline-none transition-colors cursor-pointer ${error
                            ? 'border-destructive focus:border-destructive placeholder:text-destructive/60'
                            : `border-input focus:border-${accentColor} placeholder:text-${accentColor}/60`
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
                    {value && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleChange(null);
                            }}
                            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground z-10"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
                {error && <span className="absolute top-full left-0 text-xs text-destructive">{error}</span>}
            </div>
        </div>
    );
}
