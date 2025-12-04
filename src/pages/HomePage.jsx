import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStore from '../store/useFormStore';
import { Plus, FileText, Trash2, Search, X } from 'lucide-react';
import EditorDropdown from '../components/builder/EditorDropdown';

export default function HomePage() {
    const { allForms, createNewForm, deleteForm } = useFormStore();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const sortOptions = [
        { label: 'Newest First', value: 'newest' },
        { label: 'Oldest First', value: 'oldest' },
        { label: 'Name (A-Z)', value: 'az' },
        { label: 'Name (Z-A)', value: 'za' }
    ];

    const handleCreateNew = () => {
        const newFormId = createNewForm();
        navigate(`/builder/${newFormId}`);
    };

    const filteredAndSortedForms = useMemo(() => {
        return allForms
            .filter(form =>
                form.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                switch (sortBy) {
                    case 'newest':
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    case 'oldest':
                        return new Date(a.createdAt) - new Date(b.createdAt);
                    case 'az':
                        return a.title.localeCompare(b.title);
                    case 'za':
                        return b.title.localeCompare(a.title);
                    default:
                        return 0;
                }
            });
    }, [allForms, searchQuery, sortBy]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Forms</h2>
                    <p className="text-muted-foreground mt-1">Manage and create your forms.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search forms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-9 pr-8 py-2 h-10 rounded-md border bg-background text-sm focus:outline-none transition-colors ${searchQuery ? 'border-primary' : 'border-input focus:border-primary'}`}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="w-40">
                        <EditorDropdown
                            value={sortBy}
                            options={sortOptions}
                            onChange={setSortBy}
                        />
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={handleCreateNew}
                        className="bg-primary text-primary-foreground px-4 py-2 h-10 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors whitespace-nowrap"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Create New</span>
                        <span className="sm:hidden">New</span>
                    </button>
                </div>
            </div>

            {filteredAndSortedForms.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-border rounded-lg bg-card/50">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">
                        {searchQuery ? 'No forms found' : 'No forms yet'}
                    </h3>
                    <p className="text-muted-foreground">
                        {searchQuery
                            ? `No forms match "${searchQuery}"`
                            : 'Create your first form to get started.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedForms.map((form) => (
                        <div
                            key={form.id}
                            className="group bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                            onClick={() => navigate(`/builder/${form.id}`)}
                        >
                            <div className={`absolute top-0 left-0 w-1 h-full bg-${form.accentColor}`} />
                            <h3 className="text-xl font-semibold mb-2 pr-8">{form.title}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                {form.description || 'No description'}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                                <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                                <span className="bg-secondary px-2 py-1 rounded-full">
                                    {form.fields.length} fields
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteForm(form.id);
                                }}
                                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
