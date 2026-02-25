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
            <aside className="w-16 sm:w-20 md:w-64 border-r border-border/40 bg-card/30 backdrop-blur-sm fixed h-full z-20 flex flex-col">
                <div className="p-4 sm:p-6 h-16 flex items-center justify-center md:justify-start gap-3 border-b border-border/40">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shrink-0">
                        <img src={logo} className="w-6 sm:w-8 h-6 sm:h-8 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold hidden md:block tracking-tight">Draftly</span>
                </div>

                <nav className="flex-1 p-2 sm:p-4 space-y-2 overflow-y-auto mt-4 sm:mt-0">
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
                </nav>

                <div className="p-2 sm:p-4 border-t border-border/40 pb-6 sm:pb-4">
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-full flex justify-center md:justify-start items-center gap-3 p-2 rounded-lg bg-secondary/50 mb-4 overflow-hidden transition-all hover:bg-secondary group text-left"
                    >
                        <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
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
                        className="w-full flex items-center justify-center md:justify-start gap-3 p-2 sm:p-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all font-bold text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="hidden md:block">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-16 sm:ml-20 md:ml-64 min-h-screen flex flex-col overflow-x-hidden bg-background">
                <header className="h-16 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-10 px-4 sm:px-8 flex items-center justify-between">
                    <h2 className="text-lg font-bold truncate">{activeTab === 'generate' ? 'Email Dashboard' : 'Draft History'}</h2>
                </header>

                <div className="flex-1 p-4 sm:p-6 md:p-8">
                    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
                        {activeTab === 'generate' ? (
                            <>
                                <div className="px-1 sm:px-0">
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Create New Draft</h1>
                                    <p className="text-sm sm:text-base text-muted-foreground">Fill in the details below to generate your AI-crafted email.</p>
                                </div>

                                <div className="bg-card border border-border/50 rounded-lg shadow-xl overflow-hidden backdrop-blur-sm w-full">
                                    <EmailForm />
                                </div>

                                <div className="px-2 sm:px-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-4">
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
                                </div>
                            </>
                        ) : (
                            <div className="space-y-6 px-1 sm:px-0">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Recent Drafts</h1>
                                    <p className="text-sm sm:text-base text-muted-foreground">Your history of AI-generated emails.</p>
                                </div>
                                <div className="grid gap-4">
                                    {drafts.length > 0 ? drafts.map((draft) => (
                                        <div
                                            key={draft.id}
                                            onClick={() => navigate(`/draft/${draft.id}`)}
                                            className="cursor-pointer p-4 sm:p-6 bg-card border border-border/50 rounded-lg hover:border-primary/50 transition-colors flex flex-col overflow-hidden w-full max-w-full"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2 sm:gap-4 w-full">
                                                <div className="w-full sm:flex-1 min-w-0">
                                                    <h3 className="font-bold text-base sm:text-lg truncate w-full">{draft.subject}</h3>
                                                    <p className="text-xs sm:text-sm text-muted-foreground truncate w-full">To: {draft.recipient_email || 'No recipient'}</p>
                                                </div>
                                                <span className="text-[10px] bg-secondary px-2 py-1 rounded-md font-bold uppercase shrink-0 self-start">
                                                    {new Date(draft.generated_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="bg-secondary/20 p-3 sm:p-4 rounded-md font-mono text-xs sm:text-sm whitespace-pre-wrap line-clamp-4 break-all sm:break-words w-full overflow-hidden">
                                                {draft.content}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-12 sm:py-20 border-2 border-dashed border-border rounded-lg w-full">
                                            <p className="text-sm sm:text-base text-muted-foreground">No drafts found yet. Start generating!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <footer className="p-6 sm:p-8 border-t border-border/40 text-center text-[10px] sm:text-xs text-muted-foreground font-medium opacity-60">
                    © {new Date().getFullYear()} Draftly AI.
                </footer>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-center md:justify-start gap-3 p-2 sm:p-3 rounded-md transition-all font-bold text-sm ${active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
    >
        <div className="shrink-0">{icon}</div>
        <span className="hidden md:block">{label}</span>
    </button>
);

const TipCard = ({ title, description }) => (
    <div className="p-4 sm:p-6 rounded-md bg-secondary/30 border border-border/40 h-full">
        <h4 className="font-bold text-xs sm:text-sm mb-2">{title}</h4>
        <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed font-medium">{description}</p>
    </div>
);

export default MainPage;
