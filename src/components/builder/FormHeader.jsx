import React from 'react';
import useFormStore from '../../store/useFormStore';

const ACCENT_COLORS = [
    { name: 'Indigo', value: '#4f46e5', class: 'indigo-600' },
    { name: 'Emerald', value: '#10b981', class: 'emerald-500' },
    { name: 'Rose', value: '#f43f5e', class: 'rose-500' },
    { name: 'Amber', value: '#f59e0b', class: 'amber-500' },
    { name: 'Slate', value: '#475569', class: 'slate-600' },
];

export default function FormHeader() {
    const { activeForm, updateFormMetadata, closeSidebar } = useFormStore();

    if (!activeForm) return null;

    const textareaRef = React.useRef(null);

    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [activeForm.description]);

    return (
        <div
            className="space-y-4"
            onClick={closeSidebar}
        >
            <input
                type="text"
                value={activeForm.title}
                onChange={(e) => updateFormMetadata({ title: e.target.value })}
                className="w-full text-3xl font-bold border-b border-transparent hover:border-border focus:border-primary focus:outline-none bg-transparent transition-colors py-2"
                placeholder="Form Title"
            />
            <textarea
                ref={textareaRef}
                value={activeForm.description}
                onChange={(e) => updateFormMetadata({ description: e.target.value })}
                className="w-full text-base text-muted-foreground border-b border-transparent hover:border-border focus:border-primary focus:outline-none bg-transparent resize-none transition-colors py-2 overflow-hidden"
                placeholder="Form Description"
                rows={1}
            />

            <div className="pt-4 flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Accent Color:</span>
                <div className="flex gap-2">
                    {ACCENT_COLORS.map((color) => (
                        <button
                            key={color.class}
                            onClick={() => updateFormMetadata({ accentColor: color.class })}
                            className={`w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none ${activeForm.accentColor === color.class ? 'ring-2 ring-offset-2 ring-ring scale-110' : ''}`}
                            title={color.name}
                        >
                            <div
                                className="w-full h-full rounded-full border border-border/20"
                                style={{ backgroundColor: color.value }}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
