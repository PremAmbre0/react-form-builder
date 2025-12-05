import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, X } from 'lucide-react';
import '../../assets/styles/CustomDatePicker.css';
import AppMenu from './AppMenu';

export default function AppDatePicker({ value, onChange, minDate, maxDate, placeholder = "Select date" }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const handleChange = (date) => {
        if (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            onChange(`${year}-${month}-${day}`);
            setIsOpen(false);
        } else {
            onChange('');
        }
    };

    const selectedDate = value ? new Date(value) : null;

    return (
        <div className="relative">
            <div
                ref={containerRef}
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-full"
            >
                <div className="w-full px-3 py-2 pl-10 border border-input rounded-md bg-background text-sm flex items-center h-10 cursor-pointer hover:bg-accent/50 transition-colors">
                    {value ? (
                        <span>{value}</span>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                </div>
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                {value && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleChange(null);
                        }}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            <AppMenu
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                triggerRef={containerRef}
                className="bg-popover border border-border rounded-md shadow-lg z-50"
            >
                <DatePicker
                    selected={selectedDate}
                    onChange={handleChange}
                    inline
                    minDate={minDate ? new Date(minDate) : null}
                    maxDate={maxDate ? new Date(maxDate) : null}
                />
            </AppMenu>
        </div>
    );
}
