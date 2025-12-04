import React from 'react';
import useFormStore from '../../store/useFormStore';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import FieldPicker from './FieldPicker';
import FieldConfigEditor from './FieldConfigEditor';

export default function ContextualSidebar() {
    const { sidebarMode, closeSidebar, activeForm, selectedFieldId, updateField } = useFormStore();

    const selectedField = activeForm?.fields.find(f => f.id === selectedFieldId);
    const isOpen = sidebarMode !== null;

    return (
        <div
            className={cn(
                "fixed top-0 right-0 h-full w-[500px] bg-card border-l border-border shadow-xl transform transition-transform duration-300 ease-in-out z-50",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}
        >
            {/* Close Button */}
            <button
                onClick={closeSidebar}
                className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors z-10"
            >
                <X size={20} />
            </button>

            {/* Content */}
            <div className="h-full pt-2">
                {sidebarMode === 'picker' && <FieldPicker />}

                {sidebarMode === 'settings' && selectedField && (
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-border shrink-0">
                            <h2 className="font-semibold text-lg">Edit Field</h2>
                            <p className="text-sm text-muted-foreground">Configure field properties</p>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                            <FieldConfigEditor field={selectedField} updateField={updateField} />
                        </div>
                    </div>
                )}

                {sidebarMode === 'settings' && !selectedField && (
                    <div className="p-8 text-center text-muted-foreground">
                        <p>No field selected.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
