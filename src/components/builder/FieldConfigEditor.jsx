import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle, ChevronDown, Check } from 'lucide-react';
import RuleBuilder from './RuleBuilder';
import EditorDropdown from './EditorDropdown';

export default function FieldConfigEditor({ field, updateField }) {
    const { type, config, validation } = field;
    const [isLogicExpanded, setIsLogicExpanded] = useState(true);

    const handleConfigChange = (key, value) => {
        updateField(field.id, { config: { [key]: value } });
    };

    const handleValidationChange = (key, value) => {
        updateField(field.id, { validation: { [key]: value } });
    };

    const addOption = () => {
        const newOption = { label: `Option ${config.options.length + 1}`, value: `option${config.options.length + 1}` };
        handleConfigChange('options', [...config.options, newOption]);
    };

    const updateOption = (index, key, value) => {
        const newOptions = [...config.options];
        newOptions[index] = { ...newOptions[index], [key]: value };
        // Auto-update value if it matches the old label (simple convenience)
        if (key === 'label' && newOptions[index].value === newOptions[index].label.toLowerCase().replace(/\s+/g, '')) {
            newOptions[index].value = value.toLowerCase().replace(/\s+/g, '');
        }
        handleConfigChange('options', newOptions);
    };

    const removeOption = (index) => {
        const newOptions = config.options.filter((_, i) => i !== index);
        handleConfigChange('options', newOptions);
    };

    // Check for invalid Min/Max configuration
    // Check for invalid Min/Max configuration
    const isMinMaxInvalid = validation.min !== undefined && validation.max !== undefined && validation.min > validation.max;
    const isDateRangeInvalid = validation.minDate && validation.maxDate && new Date(validation.minDate) > new Date(validation.maxDate);
    const isTimeRangeInvalid = validation.minTime && validation.maxTime && (() => {
        const [minH, minM] = validation.minTime.split(':').map(Number);
        const [maxH, maxM] = validation.maxTime.split(':').map(Number);
        return (minH * 60 + minM) > (maxH * 60 + maxM);
    })();

    return (
        <div className="space-y-4 p-1">
            {/* Settings Section */}
            <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Settings</h4>

                {/* Common Configuration */}
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Label</label>
                        <input
                            type="text"
                            value={config.label}
                            onChange={(e) => handleConfigChange('label', e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Help Text</label>
                        <input
                            type="text"
                            value={config.helpText || ''}
                            onChange={(e) => handleConfigChange('helpText', e.target.value)}
                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                            placeholder="Description or instructions for the user"
                        />
                    </div>

                    {/* Placeholder (Text, TextArea, Number, Dropdown, Date, Time) */}
                    {['text', 'textarea', 'number', 'dropdown', 'date', 'time'].includes(type) && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-muted-foreground">Placeholder</label>
                            <input
                                type="text"
                                value={config.placeholder || ''}
                                onChange={(e) => handleConfigChange('placeholder', e.target.value)}
                                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    )}

                    {/* Required Field */}
                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id={`required-${field.id}`}
                            checked={validation.required || false}
                            onChange={(e) => handleValidationChange('required', e.target.checked)}
                            className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                        />
                        <label htmlFor={`required-${field.id}`} className="text-sm font-medium cursor-pointer select-none">Required Field</label>
                    </div>
                </div>

                {/* Type Specific Settings */}
                <div className="space-y-3 pt-2 border-t border-border/50">
                    {/* Text Inputs */}
                    {type === 'text' && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">Min Length</label>
                                    <input
                                        type="number"
                                        value={validation.minLength || ''}
                                        onChange={(e) => handleValidationChange('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">Max Length</label>
                                    <input
                                        type="number"
                                        value={validation.maxLength || ''}
                                        onChange={(e) => handleValidationChange('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Validation Type</label>
                                <EditorDropdown
                                    value={config.validationType || 'none'}
                                    options={[
                                        { label: 'None (Text)', value: 'none' },
                                        { label: 'Email', value: 'email' },
                                        { label: 'Website (URL)', value: 'website' },
                                        { label: 'Number (Numeric String)', value: 'number' },
                                        { label: 'Custom Regex Pattern', value: 'regex' },
                                    ]}
                                    onChange={(value) => handleConfigChange('validationType', value)}
                                />
                            </div>
                            {config.validationType === 'regex' && (
                                <div className="space-y-3 pl-2 border-l-2 border-primary/20 ml-1">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">Regex Pattern</label>
                                        <input
                                            type="text"
                                            value={validation.patternValue || ''}
                                            onChange={(e) => handleValidationChange('patternValue', e.target.value)}
                                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary font-mono"
                                            placeholder="e.g. ^\d{4}-\d{4}$"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">Error Message</label>
                                        <input
                                            type="text"
                                            value={validation.patternErrorMessage || ''}
                                            onChange={(e) => handleValidationChange('patternErrorMessage', e.target.value)}
                                            className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary"
                                            placeholder="Custom error message"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TextArea */}
                    {type === 'textarea' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Min Length</label>
                                <input
                                    type="number"
                                    value={validation.minLength || ''}
                                    onChange={(e) => handleValidationChange('minLength', e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Max Length</label>
                                <input
                                    type="number"
                                    value={validation.maxLength || ''}
                                    onChange={(e) => handleValidationChange('maxLength', e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                    )}

                    {/* Number & Slider */}
                    {['number', 'range'].includes(type) && (
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Steps</label>
                                <input
                                    type="number"
                                    value={config.step || 1}
                                    onChange={(e) => handleConfigChange('step', parseFloat(e.target.value))}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">Min Value</label>
                                    <input
                                        type="number"
                                        value={validation.min !== undefined ? validation.min : ''}
                                        onChange={(e) => handleValidationChange('min', e.target.value ? parseFloat(e.target.value) : undefined)}
                                        className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:border-primary ${isMinMaxInvalid ? 'border-destructive focus:border-destructive text-destructive' : 'border-input'}`}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">Max Value</label>
                                    <input
                                        type="number"
                                        value={validation.max !== undefined ? validation.max : ''}
                                        onChange={(e) => handleValidationChange('max', e.target.value ? parseFloat(e.target.value) : undefined)}
                                        className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:border-primary ${isMinMaxInvalid ? 'border-destructive focus:border-destructive text-destructive' : 'border-input'}`}
                                    />
                                </div>
                            </div>
                            {isMinMaxInvalid && (
                                <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded-md">
                                    <AlertTriangle size={14} />
                                    <span>Min Value cannot be greater than Max Value.</span>
                                </div>
                            )}
                            {type === 'range' && (
                                <div className="flex items-center gap-2 pt-1">
                                    <input
                                        type="checkbox"
                                        id={`tooltip-${field.id}`}
                                        checked={config.showTooltip || false}
                                        onChange={(e) => handleConfigChange('showTooltip', e.target.checked)}
                                        className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                                    />
                                    <label htmlFor={`tooltip-${field.id}`} className="text-sm font-medium cursor-pointer select-none">Show Thumb Tooltip</label>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Rating */}
                    {type === 'rating' && (
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Max Stars (3-10)</label>
                                <input
                                    type="number"
                                    min="3"
                                    max="10"
                                    value={config.maxStars || 5}
                                    onChange={(e) => handleConfigChange('maxStars', Math.min(10, Math.max(3, parseInt(e.target.value) || 5)))}
                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Star Size</label>
                                <EditorDropdown
                                    value={config.starSize || 'medium'}
                                    options={[
                                        { label: 'Small', value: 'small' },
                                        { label: 'Medium', value: 'medium' },
                                        { label: 'Large', value: 'large' },
                                        { label: 'Custom', value: 'custom' },
                                    ]}
                                    onChange={(value) => handleConfigChange('starSize', value)}
                                />
                            </div>
                            {config.starSize === 'custom' && (
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">Custom Size (px)</label>
                                    <input
                                        type="number"
                                        min="10"
                                        max="50"
                                        value={config.customStarSize || 24}
                                        onChange={(e) => handleConfigChange('customStarSize', Math.min(50, Math.max(10, parseInt(e.target.value) || 24)))}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Selection Inputs (Dropdown, Checkbox, Radio) */}
                    {['dropdown', 'checkboxGroup', 'radioGroup'].includes(type) && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-muted-foreground">Options</label>
                                <div className="space-y-2">
                                    {config.options?.map((option, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={option.label}
                                                onChange={(e) => updateOption(index, 'label', e.target.value)}
                                                className="flex-1 px-2 py-1.5 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary"
                                                placeholder="Option Label"
                                            />
                                            {config.options.length > 2 && (
                                                <button
                                                    onClick={() => removeOption(index)}
                                                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        onClick={addOption}
                                        className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                                    >
                                        <Plus size={14} /> Add Option
                                    </button>
                                </div>
                            </div>

                            {/* Allow Other */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={`other-${field.id}`}
                                    checked={config.allowOther || false}
                                    onChange={(e) => handleConfigChange('allowOther', e.target.checked)}
                                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                                />
                                <label htmlFor={`other-${field.id}`} className="text-sm font-medium cursor-pointer select-none">Allow "Other" Option</label>
                            </div>

                            {/* Multi Select (Dropdown & Checkbox) */}
                            {['dropdown', 'checkboxGroup'].includes(type) && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={`multi-${field.id}`}
                                            checked={config.multiSelect !== undefined ? config.multiSelect : (type === 'checkboxGroup')}
                                            onChange={(e) => handleConfigChange('multiSelect', e.target.checked)}
                                            className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                                        />
                                        <label htmlFor={`multi-${field.id}`} className="text-sm font-medium cursor-pointer select-none">Allow Multiple Selections</label>
                                    </div>

                                    {config.multiSelect && (
                                        <div className="grid grid-cols-2 gap-3 pl-6">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-muted-foreground">Min Selections</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={validation.minSelections !== undefined ? validation.minSelections : ''}
                                                    onChange={(e) => handleValidationChange('minSelections', e.target.value ? parseInt(e.target.value) : undefined)}
                                                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-muted-foreground">Max Selections</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={validation.maxSelections !== undefined ? validation.maxSelections : ''}
                                                    onChange={(e) => handleValidationChange('maxSelections', e.target.value ? parseInt(e.target.value) : undefined)}
                                                    className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:border-primary ${validation.maxSelections > config.options.length ? 'border-destructive focus:border-destructive text-destructive' : 'border-input'}`}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Toggle */}
                    {type === 'toggle' && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">On Label</label>
                                    <input
                                        type="text"
                                        value={config.onLabel || 'On'}
                                        onChange={(e) => handleConfigChange('onLabel', e.target.value)}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">Off Label</label>
                                    <input
                                        type="text"
                                        value={config.offLabel || 'Off'}
                                        onChange={(e) => handleConfigChange('offLabel', e.target.value)}
                                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Toggle Style</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`toggleStyle-${field.id}`}
                                            checked={config.toggleStyle !== 'inset'}
                                            onChange={() => handleConfigChange('toggleStyle', 'offset')}
                                            className="h-4 w-4 border-input text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">Offset</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`toggleStyle-${field.id}`}
                                            checked={config.toggleStyle === 'inset'}
                                            onChange={() => handleConfigChange('toggleStyle', 'inset')}
                                            className="h-4 w-4 border-input text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">Inset</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Date */}
                    {type === 'date' && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">Min Date</label>
                                    <input
                                        type="date"
                                        value={validation.minDate || ''}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (validation.maxDate && newValue && new Date(newValue) > new Date(validation.maxDate)) {
                                                alert("Min Date cannot be after Max Date");
                                            }
                                            handleValidationChange('minDate', newValue);
                                        }}
                                        className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:border-primary ${isDateRangeInvalid ? 'border-destructive focus:border-destructive text-destructive' : 'border-input'}`}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">Max Date</label>
                                    <input
                                        type="date"
                                        value={validation.maxDate || ''}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (validation.minDate && newValue && new Date(newValue) < new Date(validation.minDate)) {
                                                alert("Max Date cannot be before Min Date");
                                            }
                                            handleValidationChange('maxDate', newValue);
                                        }}
                                        className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:border-primary ${isDateRangeInvalid ? 'border-destructive focus:border-destructive text-destructive' : 'border-input'}`}
                                    />
                                </div>
                            </div>
                            {isDateRangeInvalid && (
                                <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded-md">
                                    <AlertTriangle size={14} />
                                    <span>Min Date cannot be after Max Date.</span>
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Date Format</label>
                                <EditorDropdown
                                    value={config.dateFormat || 'YYYY-MM-DD'}
                                    options={[
                                        { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
                                        { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
                                        { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
                                    ]}
                                    onChange={(value) => handleConfigChange('dateFormat', value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Time */}
                    {type === 'time' && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">Min Time</label>
                                    <input
                                        type="time"
                                        value={validation.minTime || ''}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (validation.maxTime && newValue) {
                                                const [minH, minM] = newValue.split(':').map(Number);
                                                const [maxH, maxM] = validation.maxTime.split(':').map(Number);
                                                if ((minH * 60 + minM) > (maxH * 60 + maxM)) {
                                                    alert("Min Time cannot be after Max Time");
                                                }
                                            }
                                            handleValidationChange('minTime', newValue);
                                        }}
                                        className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:border-primary ${isTimeRangeInvalid ? 'border-destructive focus:border-destructive text-destructive' : 'border-input'}`}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-muted-foreground">Max Time</label>
                                    <input
                                        type="time"
                                        value={validation.maxTime || ''}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (validation.minTime && newValue) {
                                                const [minH, minM] = validation.minTime.split(':').map(Number);
                                                const [maxH, maxM] = newValue.split(':').map(Number);
                                                if ((minH * 60 + minM) > (maxH * 60 + maxM)) {
                                                    alert("Max Time cannot be before Min Time");
                                                }
                                            }
                                            handleValidationChange('maxTime', newValue);
                                        }}
                                        className={`w-full px-3 py-2 border rounded-md bg-background text-sm focus:outline-none focus:border-primary ${isTimeRangeInvalid ? 'border-destructive focus:border-destructive text-destructive' : 'border-input'}`}
                                    />
                                </div>
                            </div>
                            {isTimeRangeInvalid && (
                                <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded-md">
                                    <AlertTriangle size={14} />
                                    <span>Min Time cannot be after Max Time.</span>
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-muted-foreground">Time Format</label>
                                <EditorDropdown
                                    value={config.timeFormat || '24'}
                                    options={[
                                        { label: '24 Hour (14:30)', value: '24' },
                                        { label: '12 Hour (2:30 PM)', value: '12' },
                                    ]}
                                    onChange={(value) => handleConfigChange('timeFormat', value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Conditional Logic (Always available, just collapsed) */}
            <div className="space-y-3 pt-2 border-t border-border/50">
                <div
                    className="flex items-center justify-between cursor-pointer group"
                    onClick={() => setIsLogicExpanded(!isLogicExpanded)}
                >
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider group-hover:text-foreground transition-colors">Conditional Logic</h4>
                    <ChevronDown
                        size={14}
                        className={`text-muted-foreground transition-transform duration-200 mr-2 ${isLogicExpanded ? 'rotate-180' : ''}`}
                    />
                </div>

                {isLogicExpanded && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                        <RuleBuilder field={field} updateField={updateField} />
                    </div>
                )}
            </div>
        </div>
    );
}
