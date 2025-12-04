import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const EditorDropdown = ({ value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value) || options[0];

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm flex items-center justify-between focus:outline-none focus:border-primary transition-colors hover:bg-accent/50"
            >
                <span className="truncate">{selectedOption?.label || 'Select...'}</span>
                <ChevronDown size={16} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-full mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors hover:bg-primary hover:text-primary-foreground ${value === option.value ? 'bg-primary/10 text-primary font-medium' : ''}`}
                        >
                            <span>{option.label}</span>
                            {value === option.value && <Check size={14} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EditorDropdown;
