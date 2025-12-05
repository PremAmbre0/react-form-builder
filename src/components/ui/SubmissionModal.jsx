import { CheckCircle, X, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import useScrollLock from '../../hooks/useScrollLock';

export default function SubmissionModal({ isOpen, onClose, data }) {
    const [copied, setCopied] = useState(false);

    useScrollLock(isOpen);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-[700px] h-auto max-h-[90vh] p-6 relative animate-in fade-in zoom-in duration-200 flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-4 mt-2">
                    <h2 className="text-2xl font-bold">Submission Successful!</h2>
                    <p className="text-muted-foreground mt-2 text-sm">
                        Here is the data that was submitted:
                    </p>
                </div>

                <div className="relative bg-muted/50 rounded-md p-4 overflow-hidden flex-1 flex flex-col mb-4">
                    <div className="absolute top-2 right-2 z-10">
                        <button
                            onClick={handleCopy}
                            className="p-1.5 rounded-md bg-background shadow-sm border border-border text-muted-foreground hover:text-foreground transition-all"
                            title="Copy to clipboard"
                        >
                            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                    </div>
                    <div className="overflow-auto flex-1 w-full">
                        <pre className="text-xs font-mono whitespace-pre-wrap">
                            {JSON.stringify(data, null, 2)}
                        </pre>
                    </div>
                </div>

                <div className="mt-auto">
                    <button
                        onClick={onClose}
                        className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
