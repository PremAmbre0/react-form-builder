import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFormStore from '../store/useFormStore';
import { ArrowLeft, Edit } from 'lucide-react';
import SubmissionModal from '../components/ui/SubmissionModal';
import { validateField } from '../utils/validation';
import { isFieldVisible, isFieldEnabled, cleanDataBeforeSubmit } from '../utils/rules';

// Field Components
import TextInput from '../components/fields/TextInput';
import TextArea from '../components/fields/TextArea';
import NumberInput from '../components/fields/NumberInput';
import SliderInput from '../components/fields/SliderInput';
import RatingInput from '../components/fields/RatingInput';
import DropdownInput from '../components/fields/DropdownInput';
import CheckboxGroup from '../components/fields/CheckboxGroup';
import RadioGroup from '../components/fields/RadioGroup';
import ToggleInput from '../components/fields/ToggleInput';
import DateInput from '../components/fields/DateInput';
import TimeInput from '../components/fields/TimeInput';

import ColorPickerInput from '../components/fields/ColorPickerInput';

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

export default function PreviewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { activeForm, loadForm } = useFormStore();
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            loadForm(id);
        }
    }, [id, loadForm]);

    // Pre-populate Date & Time fields
    useEffect(() => {
        if (activeForm && activeForm.fields) {
            const updates = {};
            let hasUpdates = false;

            activeForm.fields.forEach(field => {
                if (!formData[field.id]) {
                    if (field.type === 'date') {
                        updates[field.id] = new Date().toISOString();
                        hasUpdates = true;
                    } else if (field.type === 'time') {
                        updates[field.id] = new Date().toISOString();
                        hasUpdates = true;
                    }
                }
            });

            if (hasUpdates) {
                setFormData(prev => ({ ...prev, ...updates }));
            }
        }
    }, [activeForm]); // Run when form loads

    if (!activeForm) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-muted-foreground">Form not found or loading...</p>
            </div>
        );
    }

    const handleChange = (fieldId, value) => {
        setFormData((prev) => ({ ...prev, [fieldId]: value }));

        // Clear error on change if desired, or validate on change
        const field = activeForm.fields.find((f) => f.id === fieldId);
        if (field) {
            const error = validateField(field, value);
            setErrors((prev) => ({ ...prev, [fieldId]: error }));
        }
    };

    const handleBlur = (fieldId) => {
        const field = activeForm.fields.find((f) => f.id === fieldId);
        if (field) {
            const value = formData[fieldId];
            const error = validateField(field, value);
            setErrors((prev) => ({ ...prev, [fieldId]: error }));
        }
    };

    const handleSubmit = () => {
        const newErrors = {};
        let hasError = false;

        activeForm.fields.forEach((field) => {
            // Check visibility
            if (field.enableConditionalLogic && !isFieldVisible(field, activeForm.fields, formData)) {
                return; // Skip hidden fields
            }

            // Check enablement
            if (field.enableConditionalLogic && !isFieldEnabled(field, activeForm.fields, formData)) {
                return; // Skip disabled fields
            }

            const value = formData[field.id];
            const error = validateField(field, value);
            if (error) {
                newErrors[field.id] = error;
                hasError = true;
            }
        });

        setErrors(newErrors);

        if (!hasError) {
            const cleanedData = cleanDataBeforeSubmit(formData, activeForm.fields);
            console.log('Form Submission Payload:', cleanedData);
            setIsModalOpen(true);
        }
    };

    const hasErrors = Object.values(errors).some((error) => error !== null);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate(`/builder/${id}`)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Builder
                </button>
                <button
                    onClick={() => navigate(`/builder/${id}`)}
                    className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-secondary/80 transition-colors"
                >
                    <Edit size={20} />
                    Edit Form
                </button>
            </div>

            <div className="bg-card border border-border rounded-xl shadow-lg relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 bg-${activeForm.accentColor}`} />
                <div className="p-8 pt-10">
                    <h1 className="text-3xl font-bold mb-2 break-words">{activeForm.title}</h1>
                    <p className="text-muted-foreground mb-6 break-words whitespace-pre-wrap">{activeForm.description}</p>
                    <hr className={`border-t border-${activeForm.accentColor}/20 mb-8`} />

                    <div className="">
                        {activeForm.fields.length === 0 ? (
                            <p className="text-center text-muted-foreground italic">This form has no fields yet.</p>
                        ) : (
                            activeForm.fields.map((field, index) => {
                                const Component = FIELD_COMPONENTS[field.type];
                                if (!Component) return null;

                                // Check Visibility
                                if (field.enableConditionalLogic && !isFieldVisible(field, activeForm.fields, formData)) {
                                    return null;
                                }

                                // Check Enablement
                                const isEnabled = field.enableConditionalLogic
                                    ? isFieldEnabled(field, activeForm.fields, formData)
                                    : true;
                                const isLast = index === activeForm.fields.length - 1;

                                return (
                                    <Component
                                        key={field.id}
                                        field={field}
                                        value={formData[field.id]}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors[field.id]}
                                        accentColor={activeForm.accentColor}
                                        isLast={isLast}
                                        disabled={!isEnabled}
                                    />
                                );
                            })
                        )}
                    </div>

                    <hr className={`border-t border-${activeForm.accentColor}/20 my-8`} />

                    <div className="flex gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={hasErrors}
                            className={`flex-1 bg-${activeForm.accentColor} text-white py-3 rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            Submit
                        </button>
                        <button
                            onClick={() => {
                                setFormData({});
                                setErrors({});
                                // Re-populate defaults if needed, or just clear. 
                                // User asked for "reset", usually implies back to initial state.
                                // But for now, let's just clear.
                                // Actually, if we want to support "default to current time", reset should probably re-trigger that.
                                // Let's just clear for now as requested "reset the form".
                            }}
                            className="px-6 py-3 rounded-md font-semibold border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            <SubmissionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setFormData({});
                    setErrors({});
                }}
                data={Object.entries(formData).reduce((acc, [key, value]) => {
                    const field = activeForm.fields.find(f => f.id === key);
                    if (field) {
                        acc[field.config.label] = value;
                    }
                    return acc;
                }, {})}
            />
        </div>
    );
}
