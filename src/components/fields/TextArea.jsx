import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TextArea({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;
    const textareaRef = useRef(null);

    const handleClear = () => {
        onChange(field.id, '');
        // Reset height after clear
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [value]);

    const handleChange = (e) => {
        onChange(field.id, e.target.value);
    };

    return (
        <div className="flex flex-col mb-4">
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
            <div className="relative">
                {value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors z-10"
                        tabIndex={-1}
                    >
                        <X size={14} />
                    </button>
                )}

                <textarea
                    ref={textareaRef}
                    id={field.id}
                    value={value || ''}
                    onChange={handleChange}
                    onBlur={() => onBlur(field.id)}
                    placeholder={config.placeholder}
                    rows={2}
                    className={`w-full px-3 py-2 ${value ? 'pr-8' : ''} border rounded-md bg-background text-sm focus:outline-none transition-colors resize-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40 ${error
                        ? 'border-destructive focus:border-destructive placeholder:text-destructive/60'
                        : `border-input focus:border-${accentColor} placeholder:text-${accentColor}/60`
                        }`}
                    style={{
                        minHeight: '38px',
                        maxHeight: '350px',
                        overflowY: 'auto'
                    }}
                />

                {validation.maxLength && (
                    <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground pointer-events-none bg-background/80 px-1 rounded">
                        {(value || '').length}/{validation.maxLength}
                    </div>
                )}
                {error && <span className="absolute top-full left-0 text-xs text-destructive">{error}</span>}
            </div>
        </div>
    );
}
