import React from 'react';
import useFormStore from '../../store/useFormStore';
import { Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';

// Field Components
import TextInput from '../fields/TextInput';
import TextArea from '../fields/TextArea';
import NumberInput from '../fields/NumberInput';
import SliderInput from '../fields/SliderInput';
import RatingInput from '../fields/RatingInput';
import DropdownInput from '../fields/DropdownInput';
import CheckboxGroup from '../fields/CheckboxGroup';
import RadioGroup from '../fields/RadioGroup';
import ToggleInput from '../fields/ToggleInput';
import DateInput from '../fields/DateInput';
import TimeInput from '../fields/TimeInput';

import ColorPickerInput from '../fields/ColorPickerInput';

const FIELD_COMPONENTS = {
    text: TextInput,
    textarea: TextArea,
    number: NumberInput,
    range: SliderInput,
    rating: RatingInput,
    dropdown: DropdownInput,
    checkboxGroup: CheckboxGroup,
    radioGroup: RadioGroup,
    toggle: ToggleInput,
    date: DateInput,
    time: TimeInput,

    color: ColorPickerInput
};

export default function FieldList() {
    const { activeForm, removeField, selectField, selectedFieldId } = useFormStore();

    if (!activeForm) return null;

    return (
        <div className="flex flex-col h-full">
            <div className="">
                {activeForm.fields.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground border-2 border-dashed border-border rounded-lg bg-accent/5">
                        <p>Add fields to the form</p>
                    </div>
                ) : (
                    activeForm.fields.map((field) => {
                        const isSelected = selectedFieldId === field.id;
                        const Component = FIELD_COMPONENTS[field.type];

                        if (!Component) return null;

                        return (
                            <div
                                key={field.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    selectField(field.id);
                                }}
                                className={cn(
                                    "relative group transition-all rounded-lg p-4 border border-transparent",
                                    isSelected
                                        ? "bg-white shadow-[0_0_0_2px_rgba(59,130,246,0.5)]"
                                        : "hover:bg-accent/50"
                                )}
                                style={isSelected ? {
                                    boxShadow: `0 0 0 2px var(--color-${activeForm.accentColor}, #4f46e5)`
                                } : {}}
                            >
                                {/* Field Preview */}
                                <div className="pointer-events-none">
                                    <Component
                                        field={field}
                                        value=""
                                        onChange={() => { }}
                                        onBlur={() => { }}
                                        error={null}
                                        accentColor={activeForm.accentColor}
                                    />
                                </div>

                                {/* Actions Overlay (Delete) */}
                                <div className={cn(
                                    "absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity",
                                    isSelected || "group-hover:opacity-100"
                                )}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeField(field.id);
                                        }}
                                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors group/btn"
                                        title="Delete Field"
                                    >
                                        <Trash2 size={18} className="transition-all group-hover/btn:stroke-[2.5px]" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
