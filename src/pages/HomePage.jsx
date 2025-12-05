import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormStore from '../store/useFormStore';
import { Plus, FileText, Trash2, Search, X, Filter, ChevronDown } from 'lucide-react';
import AppDropdown from '../components/ui/AppDropdown';

export default function HomePage() {
    const { allForms, createNewForm, deleteForm } = useFormStore();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const hasForms = allForms.length > 0;

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
                (form.title || '').toLowerCase().includes(searchQuery.toLowerCase())
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
                {/* Search */}
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
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

                <div className="flex flex-row w-full md:w-auto gap-3">
                    {/* Sort Dropdown */}
                    <div className="w-auto md:w-40 shrink-0">
                        <AppDropdown
                            value={sortBy}
                            options={sortOptions}
                            onChange={setSortBy}
                            trigger={
                                <>
                                    {/* Mobile Trigger (Icon Only) */}
                                    <button className="md:hidden w-10 h-10 flex items-center justify-center border border-input rounded-md bg-background text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors">
                                        <Filter size={20} />
                                    </button>

                                    {/* Desktop Trigger (Standard) */}
                                    <button
                                        type="button"
                                        className="hidden md:flex w-full px-3 py-2 border border-input rounded-md bg-background text-sm items-center justify-between focus:outline-none focus:border-primary transition-colors hover:bg-accent/50"
                                    >
                                        <span className="truncate">{sortOptions.find(o => o.value === sortBy)?.label || 'Select...'}</span>
                                        <ChevronDown size={16} className="text-muted-foreground" />
                                    </button>
                                </>
                            }
                        />
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={handleCreateNew}
                        className="bg-primary text-primary-foreground px-4 py-2 h-10 rounded-md flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors whitespace-nowrap flex-1 md:w-auto"
                    >
                        <Plus size={20} />
                        <span className="hidden md:inline">Create New</span>
                        <span className="md:hidden">Create Form</span>
                    </button>
                </div>
            </div>

            {filteredAndSortedForms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-solid border-border rounded-xl bg-accent/5 hover:bg-accent/10 hover:border-primary/20 transition-all duration-300 group">
                    <div className="bg-background p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 group-hover:shadow-md transition-all duration-300 ring-1 ring-border/50">
                        <FileText className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                        {searchQuery ? 'No forms found' : 'No forms yet'}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-6">
                        {searchQuery
                            ? `No forms match "${searchQuery}"`
                            : 'Create your first form to get started.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={handleCreateNew}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md shadow transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Create New Form
                        </button>
                    )}
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
