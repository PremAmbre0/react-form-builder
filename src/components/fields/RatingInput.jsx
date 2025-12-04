import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function RatingInput({ field, value, onChange, onBlur, error, accentColor, isLast }) {
    const { config, validation } = field;
    const [hoverValue, setHoverValue] = useState(0);
    const maxRating = config.maxStars || 5;
    const currentValue = value || 0;

    const getStarSize = () => {
        switch (config.starSize) {
            case 'small': return 16;
            case 'large': return 32;
            case 'custom': return config.customStarSize || 24;
            case 'medium':
            default: return 24;
        }
    };

    const iconSize = getStarSize();

    return (
        <div className="flex flex-col mb-4">
            {/* Label and Hint Group */}
            <div className="mb-2">
                <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium">
                        {config.label} {validation.required && <span className="text-destructive">*</span>}
                    </label>
                </div>
                {config.helpText && <div className="text-xs text-muted-foreground">{config.helpText}</div>}
            </div>

            {/* Input and Error Group */}
            <div className="relative">
                <div className="flex items-center gap-1" onMouseLeave={() => setHoverValue(0)}>
                    {Array.from({ length: maxRating }).map((_, index) => {
                        const ratingValue = index + 1;
                        const isFilled = (hoverValue || currentValue) >= ratingValue;

                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => onChange(field.id, ratingValue)}
                                onMouseEnter={() => setHoverValue(ratingValue)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star
                                    size={iconSize}
                                    className={cn(
                                        "transition-colors",
                                        isFilled ? "text-[var(--color-primary)] fill-[var(--color-primary)]" : "text-muted-foreground/30"
                                    )}
                                    style={isFilled ? { fill: 'var(--color-primary)', color: 'var(--color-primary)' } : {}}
                                />
                            </button>
                        );
                    })}
                </div>
                {error && <span className="absolute top-full left-0 text-xs text-destructive">{error}</span>}
            </div>
        </div>
    );
}
