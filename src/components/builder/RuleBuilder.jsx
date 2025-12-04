import React from 'react';
import { Info } from 'lucide-react';
import useFormStore from '../../store/useFormStore';
import EditorDropdown from './EditorDropdown';

export default function RuleBuilder({ field, updateField }) {
    const { activeForm } = useFormStore();
    const otherFields = activeForm?.fields.filter(f => f.id !== field.id) || [];

    // We simplify the data model for the UI, but store it in the same structure.
    // We assume ONE rule per action type for simplicity in this new UI.
    const rules = field.conditionalRules || [];
    const currentRule = rules[0] || { action: 'Show', conditionType: 'AND', criteria: [] };

    // Helper to get selected dependent field IDs from criteria
    const selectedFieldIds = currentRule.criteria.map(c => c.ifFieldId);

    const handleActionChange = (action) => {
        // Update the action of the first rule, or create it
        const newRule = { ...currentRule, action };
        updateField(field.id, { conditionalRules: [newRule] });
    };

    if (otherFields.length === 0) {
        return (
            <div className="p-4 text-center text-sm text-muted-foreground bg-muted/20 rounded-md">
                Add more fields to use conditional logic.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Condition Type (Behavior)</label>
                <EditorDropdown
                    value={currentRule.action}
                    options={[
                        { label: 'Show this field only when...', value: 'Show' },
                        { label: 'Enable this field only when...', value: 'Enable' },
                    ]}
                    onChange={(value) => handleActionChange(value)}
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Dependent On</label>
                    <div className="group relative flex items-center">
                        <Info size={14} className="text-muted-foreground cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-popover text-popover-foreground text-xs rounded shadow-md border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center">
                            {selectedFieldIds.length > 0 ? (
                                <span>
                                    <strong>Logic:</strong> This field will be <strong>{currentRule.action === 'Show' ? 'Visible' : 'Enabled'}</strong> only if <strong>{selectedFieldIds.length}</strong> other field{selectedFieldIds.length > 1 ? 's are' : ' is'} valid.
                                </span>
                            ) : (
                                "Select fields that must be valid for this field to appear/enable."
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-1">
                    {otherFields.length === 0 ? (
                        <p className="p-2 text-xs text-muted-foreground text-center">No other fields available.</p>
                    ) : (
                        otherFields.map(f => {
                            const isSelected = selectedFieldIds.includes(f.id);
                            return (
                                <div
                                    key={f.id}
                                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-accent/20' : 'hover:bg-accent/50'}`}
                                    onClick={() => {
                                        // Toggle selection
                                        const newSelected = isSelected
                                            ? selectedFieldIds.filter(id => id !== f.id)
                                            : [...selectedFieldIds, f.id];

                                        const newCriteria = newSelected.map(fieldId => ({
                                            ifFieldId: fieldId,
                                            operator: 'IsValid',
                                            ifValue: true
                                        }));

                                        const newRule = {
                                            ...currentRule,
                                            conditionType: 'AND',
                                            criteria: newCriteria
                                        };

                                        updateField(field.id, { conditionalRules: [newCriteria.length > 0 ? newRule : null].filter(Boolean) });
                                    }}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-input'}`}>
                                        {isSelected && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{f.config.label}</p>
                                        <p className="text-[10px] text-muted-foreground truncate">Type: {f.type}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
