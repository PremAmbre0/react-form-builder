import { validateField } from './validation';

/**
 * Evaluates a single condition against the form data.
 */
const evaluateCondition = (condition, allFields, formData) => {
    const { ifFieldId, operator, ifValue } = condition;
    const targetValue = formData[ifFieldId];

    // If target field doesn't exist in data, treat as false/empty
    // Exception: IsValid might want to check even if undefined (e.g. required field missing)
    // But validateField handles undefined.

    // Find target field definition for validation
    const targetField = allFields.find(f => f.id === ifFieldId);

    switch (operator) {
        case 'IsValid':
            if (!targetField) return false;
            // Returns error string if invalid, null if valid.
            // So !validateField(...) means it IS valid.
            return !validateField(targetField, targetValue);
        case 'EqualTo':
            if (targetValue === undefined) return false;
            // Loose equality to handle string/number mismatches if needed, 
            // but strict is better if types are consistent. 
            // Let's use loose for flexibility with form inputs.
            return targetValue == ifValue;
        case 'NotEqualTo':
            if (targetValue === undefined) return false;
            return targetValue != ifValue;
        case 'HasValue':
            if (targetValue === undefined) return false;
            // Checks if the target value contains the ifValue (for arrays/strings)
            // or if it simply exists/is truthy if ifValue is boolean true
            if (ifValue === true || ifValue === 'true') {
                return targetValue !== null && targetValue !== undefined && targetValue !== '';
            }
            if (Array.isArray(targetValue)) {
                return targetValue.includes(ifValue);
            }
            return String(targetValue).includes(String(ifValue));
        default:
            return false;
    }
};

/**
 * Checks if a field's conditional rules are met for a specific action.
 * Returns TRUE if the rules say the action should happen.
 * If no rules exist for the action, defaults to:
 * - Show: TRUE (Visible by default)
 * - Enable: TRUE (Enabled by default)
 * - Hide: FALSE (Not hidden by default)
 * - Disable: FALSE (Not disabled by default)
 */
export const checkFieldConditions = (field, allFields, formData, actionType) => {
    if (!field.conditionalRules || field.conditionalRules.length === 0) {
        // Default behaviors when no rules exist
        if (actionType === 'Show' || actionType === 'Enable') return true;
        return false;
    }

    // Filter rules relevant to the requested action
    const relevantRules = field.conditionalRules.filter(r => r.action === actionType);

    if (relevantRules.length === 0) {
        if (actionType === 'Show' || actionType === 'Enable') return true;
        return false;
    }

    // Evaluate each rule
    // If multiple rules exist for the same action, how do they combine?
    // Usually, if ANY rule triggers "Hide", it hides? Or "Show"?
    // Let's assume:
    // - For 'Show': If ANY rule evaluates to true, we show? Or ALL?
    // - Let's simplify: We evaluate the first matching rule or combine them.
    // - User request says: "conditionType: 'AND' | 'OR'" is per rule.
    // - A field might have multiple rules. Let's assume we check if ANY rule for this action is met.

    return relevantRules.some(rule => {
        const { conditionType, criteria } = rule;

        if (!criteria || criteria.length === 0) return false;

        if (conditionType === 'AND') {
            return criteria.every(c => evaluateCondition(c, allFields, formData));
        } else { // OR
            return criteria.some(c => evaluateCondition(c, allFields, formData));
        }
    });
};

/**
 * Determines if a field should be visible.
 * Handles 'Show' and 'Hide' rules.
 */
export const isFieldVisible = (field, allFields, formData) => {
    // 1. Check 'Show' rules
    // If 'Show' rules exist, field is hidden UNLESS rule is met.
    const showRules = field.conditionalRules?.filter(r => r.action === 'Show');
    if (showRules && showRules.length > 0) {
        const shouldShow = checkFieldConditions(field, allFields, formData, 'Show');
        if (!shouldShow) return false;
    }

    // 2. Check 'Hide' rules
    // If 'Hide' rules exist, field is visible UNLESS rule is met.
    const hideRules = field.conditionalRules?.filter(r => r.action === 'Hide');
    if (hideRules && hideRules.length > 0) {
        const shouldHide = checkFieldConditions(field, allFields, formData, 'Hide');
        if (shouldHide) return false;
    }

    return true; // Visible by default
};

/**
 * Determines if a field should be enabled.
 * Handles 'Enable' and 'Disable' rules.
 */
export const isFieldEnabled = (field, allFields, formData) => {
    // 1. Check 'Enable' rules
    const enableRules = field.conditionalRules?.filter(r => r.action === 'Enable');
    if (enableRules && enableRules.length > 0) {
        const shouldEnable = checkFieldConditions(field, allFields, formData, 'Enable');
        if (!shouldEnable) return false;
    }

    // 2. Check 'Disable' rules
    const disableRules = field.conditionalRules?.filter(r => r.action === 'Disable');
    if (disableRules && disableRules.length > 0) {
        const shouldDisable = checkFieldConditions(field, allFields, formData, 'Disable');
        if (shouldDisable) return false;
    }

    return true; // Enabled by default
};

/**
 * Cleans form data before submission.
 * Removes data for hidden fields.
 * (Validity check should be done separately or passed in, as this function doesn't validate)
 */
export const cleanDataBeforeSubmit = (formData, allFields) => {
    const cleanedData = {};

    allFields.forEach(field => {
        // Check visibility
        if (isFieldVisible(field, allFields, formData)) {
            // Only include if visible
            // Note: We are NOT checking validity here, that's done by validation.js.
            // The requirement says: "exclude... if currently invalid".
            // So we might need to pass in validity status or run validation here.
            // But validation logic is in validation.js. 
            // Let's assume the caller handles validity check or we import validateField?
            // User requirement: "If the field is currently invalid (i.e., isValid(fieldId) is false)."
            // We'll leave validity check to the caller (handleSubmit) to keep this pure, 
            // or we can import validateField. Let's import it to be safe and compliant.

            // We will just return the data for visible fields here. 
            // The handleSubmit in PreviewPage will filter out invalid ones using validateField.
            if (formData[field.id] !== undefined) {
                cleanedData[field.id] = formData[field.id];
            }
        }
    });

    return cleanedData;
};
