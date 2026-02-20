import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, signOut } from '../services/auth';
import { profileService } from '../services/profileService';
import { EmailForm } from '../components/EmailForm';
import { Mail, LogOut, User, Sparkles, Settings, History } from 'lucide-react';
import logo from '../assets/design-tool.png'

const MainPage = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('generate'); // 'generate' or 'history'
    const [drafts, setDrafts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = await getUser();
            if (!currentUser) {
                navigate('/login');
            } else {
                setUser(currentUser);
                // Fetch extended profile data
                try {
                    const profileData = await profileService.getProfile();
                    setProfile(profileData);
                } catch (err) {
                    console.error('Error fetching extended profile:', err);
                }

                if (activeTab === 'history') {
                    fetchDrafts();
                }
            }
            setLoading(false);
        };
        checkUser();
    }, [navigate, activeTab]);

    const fetchDrafts = async () => {
        try {
            const { draftService } = await import('../services/draftService');
            const data = await draftService.getDrafts();
            setDrafts(data);
        } catch (error) {
            console.error('Failed to fetch drafts:', error);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="w-20 md:w-64 border-r border-border/40 bg-card/30 backdrop-blur-sm fixed h-full z-20 flex flex-col">
                <div className="p-6 h-16 flex items-center gap-3 border-b border-border/40">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                        <img src={logo} className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold hidden md:block tracking-tight">Draftly</span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <SidebarItem
                        icon={<Sparkles className="w-5 h-5" />}
                        label="Generate"
                        active={activeTab === 'generate'}
                        onClick={() => setActiveTab('generate')}
                    />
                    <SidebarItem
                        icon={<History className="w-5 h-5" />}
                        label="Recent Drafts"
                        active={activeTab === 'history'}
                        onClick={() => setActiveTab('history')}
                    />
                    <SidebarItem
                        icon={<User className="w-5 h-5" />}
                        label="Profile"
                        onClick={() => navigate('/profile')}
                    />
                </nav>

                <div className="p-4 border-t border-border/40">
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-full flex items-center gap-3 p-2 rounded-xl bg-secondary/50 mb-4 overflow-hidden transition-all hover:bg-secondary group text-left"
                    >
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                (profile?.full_name?.[0] || user?.email?.[0] || '?').toUpperCase()
                            )}
                        </div>
                        <div className="hidden md:block min-w-0">
                            <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                                {profile?.full_name || user?.email?.split('@')[0]}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-wider">Free Plan</p>
                        </div>
                    </button>
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all font-bold text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="hidden md:block">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-20 md:ml-64 min-h-screen flex flex-col">
                <header className="h-16 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
                    <h2 className="text-lg font-bold">{activeTab === 'generate' ? 'Email Dashboard' : 'Draft History'}</h2>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            AI Online
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {activeTab === 'generate' ? (
                            <>
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">Create New Draft</h1>
                                    <p className="text-muted-foreground">Fill in the details below to generate your AI-crafted email.</p>
                                </div>

                                <div className="bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
                                    <EmailForm />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                    <TipCard
                                        title="Tip: Be Specific"
                                        description="The more details you provide in the prompt, the better Draftly can tailor the content."
                                    />
                                    <TipCard
                                        title="Tone Matters"
                                        description="Switch between tones to see how the same message can be perceived differently."
                                    />
                                    <TipCard
                                        title="Iterate & Polish"
                                        description="Use the 'Improve' button to refine your generated draft further."
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">Recent Drafts</h1>
                                    <p className="text-muted-foreground">Your history of AI-generated emails.</p>
                                </div>
                                <div className="grid gap-4">
                                    {drafts.length > 0 ? drafts.map((draft) => (
                                        <div key={draft.id} className="p-6 bg-card border border-border/50 rounded-2xl hover:border-primary/50 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-lg">{draft.subject}</h3>
                                                    <p className="text-sm text-muted-foreground">To: {draft.recipient_email || 'No recipient'}</p>
                                                </div>
                                                <span className="text-[10px] bg-secondary px-2 py-1 rounded-full font-bold uppercase">
                                                    {new Date(draft.generated_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="bg-secondary/20 p-4 rounded-xl font-mono text-sm whitespace-pre-wrap line-clamp-4">
                                                {draft.content}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
                                            <p className="text-muted-foreground">No drafts found yet. Start generating!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <footer className="p-8 border-t border-border/40 text-center text-xs text-muted-foreground font-medium opacity-60">
                    © {new Date().getFullYear()} Draftly AI. Powered by Gemini Pro.
                </footer>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-sm ${active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
    >
        <div className="shrink-0">{icon}</div>
        <span className="hidden md:block">{label}</span>
    </button>
);

const TipCard = ({ title, description }) => (
    <div className="p-6 rounded-2xl bg-secondary/30 border border-border/40">
        <h4 className="font-bold text-sm mb-2">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed font-medium">{description}</p>
    </div>
);

export default MainPage;
