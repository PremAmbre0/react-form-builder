import {
    Type, AlignLeft, Hash,
    Sliders, Star,
    ChevronDown, CheckSquare, CircleDot, ToggleLeft,
    Calendar, Clock
} from 'lucide-react';

export const FIELD_DEFINITIONS = {
    // 1. Text Inputs
    text: {
        type: 'text',
        label: 'Short Answer',
        icon: Type,
        config: {
            label: 'Untitled Short Answer',
            placeholder: 'untitled placeholder',
            defaultValue: '',
            helpText: '',
            validationType: 'none'
        },
        validation: {
            required: false,
            minLength: 1,
            maxLength: 100,
            patternType: null,
            patternValue: '',
            patternErrorMessage: ''
        },
        conditionalRules: []
    },
    textarea: {
        type: 'textarea',
        label: 'Paragraph',
        icon: AlignLeft,
        config: { label: 'Untitled Paragraph', placeholder: 'untitled placeholder', defaultValue: '', helpText: '' },
        validation: { required: false, minLength: 1, maxLength: 300 },
        conditionalRules: []
    },

    // 2. Numerical Inputs
    number: {
        type: 'number',
        label: 'Number',
        icon: Hash,
        config: { label: 'Untitled Number', placeholder: '0', defaultValue: undefined, decimalPlaces: 0, step: 1, helpText: '' },
        validation: {
            required: false,
            min: 1,
            max: 100,
            patternType: null,
            patternValue: '',
            patternErrorMessage: ''
        },
        conditionalRules: []
    },
    range: {
        type: 'range',
        label: 'Slider',
        icon: Sliders,
        config: {
            label: 'Untitled Slider',
            defaultValue: 50,
            step: 1,
            showLabels: true,
            showTooltip: false,
            persistentTooltip: false,
            helpText: ''
        },
        validation: { required: false, min: 1, max: 100 },
        conditionalRules: []
    },
    rating: {
        type: 'rating',
        label: 'Star Rating',
        icon: Star,
        config: {
            label: 'Untitled Star Rating',
            defaultValue: 0,
            maxStars: 5,
            starSize: 'medium',
            customStarSize: 24,
            helpText: ''
        },
        validation: { required: false },
        conditionalRules: []
    },

    // 3. Selection Inputs
    dropdown: {
        type: 'dropdown',
        label: 'Dropdown',
        icon: ChevronDown,
        config: {
            label: 'Untitled Dropdown',
            placeholder: 'Select an option',
            defaultValue: '',
            options: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }],
            multiSelect: false,
            allowOther: false,
            helpText: ''
        },
        validation: { required: false, allowCustom: false },
        conditionalRules: []
    },
    checkboxGroup: {
        type: 'checkboxGroup',
        label: 'Checkbox Group',
        icon: CheckSquare,
        config: {
            label: 'Untitled Checkbox Group',
            options: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }],
            multiSelect: true,
            allowOther: false,
            helpText: ''
        },
        validation: { required: false, minSelections: undefined, maxSelections: undefined },
        conditionalRules: []
    },
    radioGroup: {
        type: 'radioGroup',
        label: 'Radio Group',
        icon: CircleDot,
        config: {
            label: 'Untitled Radio Group',
            options: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }],
            multiSelect: false,
            allowOther: false,
            helpText: ''
        },
        validation: { required: false },
        conditionalRules: []
    },
    toggle: {
        type: 'toggle',
        label: 'Toggle',
        icon: ToggleLeft,
        config: { label: 'Untitled Toggle', defaultValue: false, onLabel: 'On', offLabel: 'Off', toggleStyle: 'offset', helpText: '' },
        validation: { required: false },
        conditionalRules: []
    },

    // 4. Date and Time Inputs
    date: {
        type: 'date',
        label: 'Date',
        icon: Calendar,
        config: { label: 'Untitled Date', placeholder: 'Select date', defaultValue: '', dateFormat: 'YYYY-MM-DD', helpText: '' },
        validation: { required: false, minDate: undefined, maxDate: undefined, disabledDates: [] },
        conditionalRules: [],
        enableConditionalLogic: false
    },
    time: {
        type: 'time',
        label: 'Time',
        icon: Clock,
        config: { label: 'Untitled Time', placeholder: 'Select time', defaultValue: '', timeFormat: '24', helpText: '' },
        validation: { required: false, minTime: undefined, maxTime: undefined },
        conditionalRules: []
    }
};

export const FIELD_CATEGORIES = {
    'Text Inputs': ['text', 'textarea'],
    'Numerical': ['number', 'range', 'rating'],
    'Selection': ['dropdown', 'checkboxGroup', 'radioGroup', 'toggle'],
    'Date & Time': ['date', 'time']
};
