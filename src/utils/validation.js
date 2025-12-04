export function validateField(field, value) {
    const { validation = {}, config = {}, type } = field;

    // Required check
    if (validation.required) {
        if (value === null || value === undefined || value === '') {
            return 'This field is required';
        }
        if (Array.isArray(value) && value.length === 0) {
            return 'Please select at least one option';
        }
    }

    // Strict check for value presence to allow '0'
    const hasValue = value !== null && value !== undefined && value !== '';

    if (hasValue) {
        // String length checks
        if (typeof value === 'string') {
            if (validation.minLength && value.length < validation.minLength) {
                return `Minimum length is ${validation.minLength} characters`;
            }
            if (validation.maxLength && value.length > validation.maxLength) {
                return `Maximum length is ${validation.maxLength} characters`;
            }
        }

        // Number checks (for Number, Range, Rating fields)
        if (['number', 'range', 'rating'].includes(type)) {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
                return 'Please enter a valid number';
            }
            if (validation.min !== undefined && numValue < validation.min) {
                return `Minimum value is ${validation.min}`;
            }
            if (validation.max !== undefined && numValue > validation.max) {
                return `Maximum value is ${validation.max}`;
            }
        }

        // Date/Time checks
        if (['date', 'datetimeLocal', 'datetime-local'].includes(type)) {
            const dateValue = new Date(value).getTime();
            if (validation.minDate && !isNaN(dateValue)) {
                const minDate = new Date(validation.minDate).getTime();
                if (dateValue < minDate) {
                    return `Date must be after ${validation.minDate}`;
                }
            }
            if (validation.maxDate && !isNaN(dateValue)) {
                const maxDate = new Date(validation.maxDate).getTime();
                if (dateValue > maxDate) {
                    return `Date must be before ${validation.maxDate}`;
                }
            }
            if (validation.minDateTime && !isNaN(dateValue)) {
                const minDate = new Date(validation.minDateTime).getTime();
                if (dateValue < minDate) {
                    return `Date must be after ${new Date(validation.minDateTime).toLocaleString()}`;
                }
            }
            if (validation.maxDateTime && !isNaN(dateValue)) {
                const maxDate = new Date(validation.maxDateTime).getTime();
                if (dateValue > maxDate) {
                    return `Date must be before ${new Date(validation.maxDateTime).toLocaleString()}`;
                }
            }
        }

        if (type === 'time') {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                const hours = date.getHours();
                const minutes = date.getMinutes();
                const totalMinutes = hours * 60 + minutes;

                if (validation.minTime) {
                    const [minH, minM] = validation.minTime.split(':').map(Number);
                    if (totalMinutes < minH * 60 + minM) {
                        return `Time must be after ${validation.minTime}`;
                    }
                }
                if (validation.maxTime) {
                    const [maxH, maxM] = validation.maxTime.split(':').map(Number);
                    if (totalMinutes > maxH * 60 + maxM) {
                        return `Time must be before ${validation.maxTime}`;
                    }
                }
            }
        }

        // Email check (Validation Type)
        if (type === 'email' || (type === 'text' && config?.validationType === 'email')) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return 'Please enter a valid email address';
            }
        }

        // URL check (Validation Type)
        if (type === 'url' || (type === 'text' && config?.validationType === 'website')) {
            try {
                new URL(value);
            } catch (_) {
                return 'Please enter a valid URL';
            }
        }

        // Numeric String check (Validation Type)
        if (type === 'text' && config?.validationType === 'number') {
            const numRegex = /^[0-9]*$/;
            if (!numRegex.test(value)) {
                return 'Please enter a valid number';
            }
            const numValue = parseFloat(value);
            if (validation.min !== undefined && numValue < validation.min) {
                return `Minimum value is ${validation.min}`;
            }
            if (validation.max !== undefined && numValue > validation.max) {
                return `Maximum value is ${validation.max}`;
            }
        }

        // Custom Regex Pattern Check
        if (config?.validationType === 'regex' && validation.patternValue) {
            try {
                const regex = new RegExp(validation.patternValue);
                if (!regex.test(value)) {
                    return validation.patternErrorMessage || 'Invalid format';
                }
            } catch (e) {
                console.warn('Invalid regex pattern:', validation.patternValue);
            }
        }
    }

    // Array checks (Multi-select Dropdown, Checkbox Group)
    if (Array.isArray(value)) {
        if (validation.minSelections && value.length < validation.minSelections) {
            return `Please select at least ${validation.minSelections} option${validation.minSelections > 1 ? 's' : ''}`;
        }
        if (validation.maxSelections && value.length > validation.maxSelections) {
            return `Please select at most ${validation.maxSelections} option${validation.maxSelections > 1 ? 's' : ''}`;
        }
    }

    return null;
}
