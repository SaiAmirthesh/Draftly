import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, Plus, LogOut } from 'lucide-react';
import logo from '../assets/design-tool.png';
import { getUser, signOut } from '../services/auth';
import { draftService } from '../services/draftService';
import { profileService } from '../services/profileService';

const Sidebar = ({ isCollapsed, setIsCollapsed, activeTab, setActiveTab }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [drafts, setDrafts] = useState([]);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const currentUser = await getUser();
            if (currentUser) {
                setUser(currentUser);
                const profileData = await profileService.getProfile();
                setProfile(profileData);
            }

            const draftsData = await draftService.getDrafts();
            setDrafts(draftsData);
        } catch (error) {
            console.error('Failed to fetch sidebar data:', error);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const handleNewChat = () => {
        if (location.pathname !== '/main') {
            navigate('/main');
        }
        setActiveTab('generate');
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-full z-20 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${isCollapsed ? 'w-16 lg:w-16' : 'w-64'
                }`}
        >
            {/* Header / Logo */}
            <div className={`h-14 flex items-center shrink-0 px-3 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/main')}>
                        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shrink-0">
                            <img src={logo} alt="Draftly" className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <span className="font-medium text-[15px] tracking-wide text-sidebar-foreground">Draftly</span>
                    </div>
                )}

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                    {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                </button>
            </div>

            {/* New Chat Button */}
            <div className="px-3 py-2 shrink-0">
                <button
                    onClick={handleNewChat}
                    className={`flex items-center gap-2 w-full rounded-md hover:bg-sidebar-accent transition-colors border border-transparent ${isCollapsed ? 'justify-center p-2' : 'px-2 py-1.5'
                        }`}
                >
                    <div className={`flex items-center justify-center shrink-0 ${!isCollapsed && 'w-6 h-6 rounded bg-primary text-primary-foreground'}`}>
                        <Plus className={`${isCollapsed ? 'w-5 h-5 text-sidebar-foreground/70' : 'w-4 h-4'}`} />
                    </div>
                    {!isCollapsed && <span className="text-[14px] text-sidebar-foreground font-medium">New Draft</span>}
                </button>
            </div>

            {/* Recent Drafts List */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 pt-1 scrollbar-hide">
                {!isCollapsed && drafts.length > 0 && (
                    <div className="mb-2 pl-2">
                        <span className="text-[11px] font-semibold text-sidebar-foreground/50 uppercase tracking-wider">Recent</span>
                    </div>
                )}

                {drafts.map((draft) => (
                    <button
                        key={draft.id}
                        onClick={() => navigate(`/draft/${draft.id}`)}
                        title={isCollapsed ? draft.subject : undefined}
                        className={`w-full flex items-center gap-2 rounded-md hover:bg-sidebar-accent transition-colors group mb-0.5 ${isCollapsed ? 'justify-center p-2' : 'px-2 py-1.5 text-left'
                            } ${location.pathname === `/draft/${draft.id}` ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/70'}`}
                    >
                        {!isCollapsed ? (
                            <span className="text-[13px] truncate flex-1 font-medium group-hover:text-sidebar-foreground">
                                {draft.subject || 'Untitled Draft'}
                            </span>
                        ) : (
                            <div className="w-5 h-5 rounded-full bg-sidebar-accent flex items-center justify-center text-[10px] font-bold">
                                {draft.subject?.[0]?.toUpperCase() || 'D'}
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Footer / Account */}
            <div className="p-3 border-t border-sidebar-border shrink-0 space-y-2">
                {/* Profile Box */}
                <button
                    className={`w-full flex items-center gap-3 rounded-md hover:bg-sidebar-accent transition-colors group ${isCollapsed ? 'justify-center p-2' : 'px-2 py-2 text-left'
                        }`}
                >
                    <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0 overflow-hidden">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            (profile?.full_name?.[0] || user?.email?.[0] || '?').toUpperCase()
                        )}
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-sidebar-foreground group-hover:text-sidebar-accent-foreground transition-colors">
                                {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                            </p>
                            <p className="text-[10px] text-sidebar-foreground/50 truncate uppercase font-bold tracking-wider">Free Plan</p>
                        </div>
                    )}
                </button>

                {/* Sign Out */}
                <button
                    onClick={handleSignOut}
                    title={isCollapsed ? "Sign Out" : undefined}
                    className={`w-full flex items-center gap-2 rounded-md hover:bg-destructive/10 text-sidebar-foreground/70 hover:text-destructive transition-colors ${isCollapsed ? 'justify-center p-2' : 'px-2 py-1.5'
                        }`}
                >
                    <LogOut className={`shrink-0 ${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    {!isCollapsed && <span className="text-[13px] font-medium text-left flex-1">Sign Out</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
