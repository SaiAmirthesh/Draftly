import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Sparkles, Trash2, Mail } from 'lucide-react';
import { draftService } from '../services/draftService';
import { geminiService } from '../services/geminiService';
import Loader from '../components/Loader';
import { useNotification } from '../components/notification';

const DraftPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [draft, setDraft] = useState(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchDraft = async () => {
            try {
                const data = await draftService.getDraftById(id);
                setDraft(data);
                setContent(data.content);
            } catch (err) {
                console.error("Failed to fetch draft:", err);
                showNotification("Failed to load this draft.", "error");
                navigate('/main');
            } finally {
                setLoading(false);
            }
        };
        fetchDraft();
    }, [id, navigate]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await draftService.updateDraft(id, { content });
            showNotification('Draft saved successfully!', 'success');
        } catch (err) {
            console.error("Failed to update draft:", err);
            showNotification("Failed to save changes.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this draft?")) return;
        try {
            await draftService.deleteDraft(id);
            showNotification("Draft deleted.", "success");
            navigate('/main');
        } catch (err) {
            console.error("Failed to delete draft:", err);
            showNotification("Failed to delete draft.", "error");
        }
    };

    const handleImprove = async () => {
        if (!content) return;
        setAiGenerating(true);
        try {
            const prompt = `
                The following is an email draft. Please improve it and make it more polished.
                Retain as much original intent and metadata context as possible.
                Current Tone targeted: ${draft?.metadata?.tone || 'Professional'}
                Current Draft:
                ${content}
            `;
            const result = await geminiService.generateEmail(prompt);

            // Wait, we should probably only replace the body or subjective text...
            // the result currently returns subject and content.
            // Subject might be new or refined. We can replace entire content.
            setContent(result.content);

            // Auto-save the improvement
            await draftService.updateDraft(id, {
                content: result.content,
                subject: result.subject
            });

        } catch (err) {
            console.error("Failed to refine draft:", err);
            showNotification("Failed to improve email.", "error");
        } finally {
            setAiGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (!draft) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="h-16 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold">{draft.subject || 'Untitled Draft'}</h2>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                            {new Date(draft.generated_at).toLocaleString()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDelete}
                        className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete draft"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-secondary text-foreground rounded-lg font-bold hover:bg-secondary/80 transition-all flex items-center gap-2"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Save
                    </button>
                    <button
                        onClick={handleImprove}
                        disabled={aiGenerating}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
                    >
                        <Sparkles className="w-4 h-4" />
                        Refine with AI
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 flex flex-col max-w-5xl mx-auto w-full">
                {aiGenerating ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <Loader />
                        <p className="mt-4 text-muted-foreground font-medium animate-pulse">Polishing your draft...</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 flex flex-col bg-card border border-border/50 rounded-lg shadow-xl overflow-hidden p-6"
                    >
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/40">
                            <Mail className="w-5 h-5 text-primary" />
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Draft Content</span>
                        </div>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="flex-1 w-full bg-transparent border-none focus:ring-0 p-2 font-mono text-sm leading-relaxed resize-none scrollbar-hide outline-none"
                            placeholder="Your email draft content..."
                        />
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default DraftPage;
