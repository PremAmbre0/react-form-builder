import { CheckCircle, X, Copy, Check, FileJson, Table2, FileText } from 'lucide-react';
import { useState } from 'react';
import useScrollLock from '../../hooks/useScrollLock';

export default function SubmissionModal({ isOpen, onClose, data }) {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('report');

    useScrollLock(isOpen);

    if (!isOpen) return null;

    const handleCopy = () => {
        let contentToCopy = '';
        if (activeTab === 'json') {
            contentToCopy = JSON.stringify(data, null, 2);
        } else if (activeTab === 'report') {
            contentToCopy = data.map(item => `${item.label}: ${item.value}`).join('\n');
        } else if (activeTab === 'table') {
            contentToCopy = data.map(item => `${item.label}\t${item.value}`).join('\n');
        }

        navigator.clipboard.writeText(contentToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-[800px] h-auto max-h-[90vh] p-6 relative animate-in fade-in zoom-in duration-200 flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6 mt-2">
                    <div className="flex justify-center mb-3">
                        <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold">Submission Successful!</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Your form has been successfully submitted.
                    </p>
                </div>

                <div className="flex items-center gap-2 mb-4 border-b border-border">
                    <button
                        onClick={() => setActiveTab('report')}
                        className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'report'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <FileText size={16} />
                        Report
                    </button>
                    <button
                        onClick={() => setActiveTab('table')}
                        className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'table'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <Table2 size={16} />
                        Table
                    </button>
                    <button
                        onClick={() => setActiveTab('json')}
                        className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'json'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <FileJson size={16} />
                        JSON
                    </button>
                </div>

                <div className="relative bg-muted/30 rounded-md border border-border overflow-hidden flex-1 flex flex-col mb-4 min-h-[300px]">
                    <div className="absolute top-2 right-2 z-10">
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-background shadow-sm border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
                            title="Copy content"
                        >
                            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>

                    <div className="overflow-auto flex-1 w-full p-4">
                        {activeTab === 'report' && (
                            <div className="space-y-4 max-w-2xl mx-auto py-2">
                                {data.map((item) => (
                                    <div key={item.id} className="border-b border-border/50 last:border-0 pb-3 last:pb-0">
                                        <h4 className="text-sm font-semibold text-foreground mb-1">
                                            {item.label}
                                        </h4>
                                        <div className="text-sm text-muted-foreground">
                                            {item.value ? (
                                                <span className="text-foreground">{String(item.value)}</span>
                                            ) : (
                                                <span className="italic opacity-50">No answer</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'table' && (
                            <div className="w-full">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                                        <tr>
                                            <th className="p-3 border-b border-border w-1/2">Question</th>
                                            <th className="p-3 border-b border-border w-1/2">Answer</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item) => (
                                            <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20">
                                                <td className="p-3 font-medium text-foreground">{item.label}</td>
                                                <td className="p-3 text-muted-foreground">
                                                    {item.value ? (
                                                        <span className="text-foreground">{String(item.value)}</span>
                                                    ) : (
                                                        <span className="italic opacity-50">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'json' && (
                            <pre className="text-xs font-mono whitespace-pre-wrap text-foreground">
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        )}
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
