import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Save, User, Camera, Shield, LogOut, X, Upload } from 'lucide-react';
import { profileService } from '../services/profileService';
import { signOut } from '../services/auth';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        avatar_url: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileService.getProfile();
                if (data) {
                    setProfile({
                        full_name: data.full_name || '',
                        email: data.email || '',
                        avatar_url: data.avatar_url || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await profileService.updateProfile({
                full_name: profile.full_name,
                avatar_url: profile.avatar_url
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setMessage({ type: '', text: '' });
        try {
            const publicUrl = await profileService.uploadAvatar(file);
            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            setMessage({ type: 'success', text: 'Avatar uploaded successfully!' });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: 'Failed to upload avatar. Check bucket permissions.' });
        } finally {
            setUploading(false);
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
        <div className="min-h-screen bg-background selection:bg-primary/20 flex flex-col overflow-x-hidden">
            {/* Header / Navigation */}
            <header className="h-16 border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between w-full">
                <div className="flex items-center gap-4 min-w-0">
                    <button
                        onClick={() => navigate('/main')}
                        className="p-2 hover:bg-secondary rounded-lg transition-all group shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                    </button>
                    <h2 className="text-lg font-bold truncate">Profile Settings</h2>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                        <User className="w-4 h-4" />
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Avatar & Quick Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <section className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-lg p-8 text-center">
                            <div className="relative inline-block group">
                                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold ring-4 ring-background overflow-hidden">
                                    {profile.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        profile.email?.[0]?.toUpperCase()
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-all z-10"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>
                            <h3 className="mt-4 text-xl font-bold">{profile.full_name || profile.email?.split('@')[0]}</h3>
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                        </section>
                        <div className="mt-6">
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-destructive/20 text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all font-bold text-sm"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>


                    {/* Right Column: Profile Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-card border border-border/50 rounded-lg shadow-xl p-8 backdrop-blur-md">
                            <h3 className="text-xl font-bold mb-6">Personal Information</h3>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={profile.full_name}
                                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full px-4 py-3 bg-secondary/30 border border-border/50 rounded-lg font-medium text-muted-foreground cursor-not-allowed"
                                    />
                                    <p className="text-[10px] text-muted-foreground px-1 mt-1 font-medium">Email cannot be changed after registration.</p>
                                </div>

                                <div className="pt-4 flex items-center justify-between gap-4">
                                    <AnimatePresence>
                                        {(message.text || uploading) && (
                                            <motion.p
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0 }}
                                                className={`text-sm font-bold ${message.type === 'success' || uploading ? 'text-primary' : 'text-destructive'}`}
                                            >
                                                {uploading ? 'Uploading avatar...' : message.text}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                    <button
                                        type="submit"
                                        disabled={saving || uploading}
                                        className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </section>

                    </div>
                </div>
            </main>

            {/* Avatar Upload Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-md bg-card border border-border/50 rounded-[1.5rem] shadow-2xl p-8 overflow-hidden"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-2 hover:bg-secondary rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>

                            <h3 className="text-2xl font-bold mb-8 text-center">Update Avatar</h3>

                            <div className="flex flex-col items-center gap-8">
                                <div className="w-40 h-40 rounded-full border-4 border-primary/20 p-2">
                                    <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center text-primary text-5xl font-bold overflow-hidden">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            profile.email?.[0]?.toUpperCase()
                                        )}
                                    </div>
                                </div>

                                <div className="w-full space-y-3">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold hover:scale-[1.02] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {uploading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload className="w-5 h-5" />}
                                        Upload New Photo
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full py-4 bg-secondary text-secondary-foreground rounded-lg font-bold hover:bg-secondary/80 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <p className="text-xs text-muted-foreground text-center px-4 font-medium">
                                    Recommended: Square image, at least 400x400px.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePage;
