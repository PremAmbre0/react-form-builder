import {
    Type, AlignLeft, Hash,
    Sliders, Star,
    ChevronDown, CheckSquare, CircleDot, ToggleLeft,
    Calendar, Clock, CalendarClock,
    Palette
} from 'lucide-react';

export const FIELD_DEFINITIONS = {
    // 1. Text Inputs (Merged)
    text: {
        type: 'text',
        label: 'Short Answer',
        icon: Type,
        config: {
            label: 'Short Answer',
            placeholder: '',
            defaultValue: '',
            helpText: '',
            validationType: 'none' // 'none', 'email', 'website', 'number'
        },
        validation: {
            required: false,
            minLength: undefined,
            maxLength: 200,
            patternType: null, // 'regex' or null
            patternValue: '',
            patternErrorMessage: ''
        },
        conditionalRules: []
    },
    textarea: {
        type: 'textarea',
        label: 'Paragraph',
        icon: AlignLeft,
        config: { label: 'Paragraph', placeholder: '', defaultValue: '', helpText: '' },
        validation: { required: false, minLength: undefined, maxLength: undefined },
        conditionalRules: []
    },

    // 2. Numerical Inputs
    number: {
        type: 'number',
        label: 'Number',
        icon: Hash,
        config: { label: 'Number', placeholder: '', defaultValue: undefined, decimalPlaces: 0, helpText: '' },
        validation: {
            required: false,
            min: undefined,
            max: undefined,
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
        config: { label: 'Slider', defaultValue: 50, showLabels: true, helpText: '' },
        validation: { required: false, min: 0, max: 100 },
        conditionalRules: []
    },
    rating: {
        type: 'rating',
        label: 'Star Rating',
        icon: Star,
        config: { label: 'Rating', defaultValue: 0, helpText: '' },
        validation: { required: false, scale: 5 },
        conditionalRules: []
    },

    // 3. Selection Inputs
    dropdown: {
        type: 'dropdown',
        label: 'Dropdown',
        icon: ChevronDown,
        config: {
            label: 'Select an option',
            defaultValue: '',
            options: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }],
            multiSelect: false,
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
            label: 'Select options',
            options: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }],
            multiSelect: true,
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
            label: 'Select one',
            options: [{ label: 'Option 1', value: 'option1' }, { label: 'Option 2', value: 'option2' }],
            multiSelect: false,
            helpText: ''
        },
        validation: { required: false },
        conditionalRules: []
    },
    toggle: {
        type: 'toggle',
        label: 'Toggle',
        icon: ToggleLeft,
        config: { label: 'Toggle', defaultValue: false, onLabel: 'On', offLabel: 'Off', toggleStyle: 'offset', helpText: '' },
        validation: { required: false },
        conditionalRules: []
    },

    // 4. Date and Time Inputs
    date: {
        type: 'date',
        label: 'Date',
        icon: Calendar,
        config: { label: 'Date', defaultValue: '', helpText: '' },
        validation: { required: false, minDate: undefined, maxDate: undefined, disabledDates: [] },
        conditionalRules: [],
        enableConditionalLogic: false
    },
    time: {
        type: 'time',
        label: 'Time',
        icon: Clock,
        config: { label: 'Time', defaultValue: '', timeFormat: '24', helpText: '' },
        validation: { required: false, minTime: undefined, maxTime: undefined },
        conditionalRules: []
    },

    // 5. Special Inputs
    color: {
        type: 'color',
        label: 'Color Picker',
        icon: Palette,
        config: { label: 'Pick a color', defaultValue: '#000000', helpText: '' },
        validation: { required: false },
        conditionalRules: []
    }
};

export const FIELD_CATEGORIES = {
    'Text Inputs': ['text', 'textarea'],
    'Numerical': ['number', 'range', 'rating'],
    'Selection': ['dropdown', 'checkboxGroup', 'radioGroup', 'toggle'],
    'Date & Time': ['date', 'time'],
    'Special': ['color']
};
