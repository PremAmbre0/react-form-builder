import React from 'react';
import { Upload } from 'lucide-react';

export default function FileUploadInput({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;

    // For file inputs, value handling is a bit different (usually File object or URL)
    // Here we'll just show the file name if selected, or handle the change

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            // In a real app, we'd upload this or store the file object
            // For now, let's just store the name(s)
            const fileNames = Array.from(files).map(f => f.name).join(', ');
            onChange(field.id, fileNames);
        }
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
                <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent/5 transition-colors ${error ? 'border-destructive/50' : 'border-border'}`}>
                    <input
                        type="file"
                        id={field.id}
                        onChange={handleFileChange}
                        onBlur={() => onBlur(field.id)}
                        multiple={config.multiple}
                        accept={config.acceptedFileTypes}
                        className="hidden"
                    />
                    <label htmlFor={field.id} className="cursor-pointer flex flex-col items-center gap-2 w-full h-full">
                        <div className={`p-3 rounded-full bg-${accentColor}/10 text-${accentColor}`} style={{ color: `var(--${accentColor})`, backgroundColor: `var(--${accentColor}1a)` }}>
                            <Upload size={24} />
                        </div>
                        <div className="text-sm">
                            <span className="font-medium text-primary hover:underline">Click to upload</span> or drag and drop
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {config.acceptedFileTypes ? config.acceptedFileTypes : 'Any file'}
                            {validation.maxFileSize && ` (Max ${validation.maxFileSize}MB)`}
                        </p>
                        {value && (
                            <div className="mt-2 text-xs font-medium text-foreground bg-muted px-2 py-1 rounded">
                                Selected: {value}
                            </div>
                        )}
                    </label>
                </div>
                {error && <span className="absolute top-full left-0 text-xs text-destructive">{error}</span>}
            </div>
        </div>
    );
}
