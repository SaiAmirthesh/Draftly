import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../services/auth';
import { EmailForm } from '../components/EmailForm';
import Sidebar from '../components/Sidebar';

const MainPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('generate');
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = await getUser();
            if (!currentUser) {
                navigate('/login');
            } else {
                setUser(currentUser);
            }
            setLoading(false);
        };
        checkUser();

        // Responsive sidebar logic based on screen width
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsCollapsed(true);
            } else {
                setIsCollapsed(false);
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-background text-foreground">
            {/* Sidebar */}
            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Main Content */}
            <main
                className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'
                    }`}
            >
                {/* Header */}
                <header className="h-14 flex items-center justify-center md:justify-start px-4 md:px-8 border-b border-transparent">
                    <h2 className="text-sm font-medium text-muted-foreground">Draftly <span className="text-foreground">/ New Draft</span></h2>
                </header>

                <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="text-center md:text-left mb-8 md:mb-12">
                            <h1 className="text-2xl md:text-3xl font-medium text-foreground mb-2">What would you like to draft today?</h1>
                            <p className="text-sm text-muted-foreground">Describe your email, letter, or message, and Draftly will craft it for you.</p>
                        </div>

                        <div className="w-full">
                            <EmailForm />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainPage;
