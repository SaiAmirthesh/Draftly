import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'success', duration = 4000) => {
        const id = Date.now() + Math.random();
        setNotifications((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="fixed top-20 right-6 z-50 flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {notifications.map(({ id, message, type }) => (
                        <motion.div
                            key={id}
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9, transition: { duration: 0.2 } }}
                            className={`pointer-events-auto flex items-center gap-3 w-80 p-4 rounded-l shadow-2xl border backdrop-blur-xl ${type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                                    type === 'error' ? 'bg-destructive/10 border-destructive/20 text-destructive' :
                                        'bg-secondary/90 border-border text-foreground'
                                }`}
                        >
                            <div className="shrink-0 flex items-center justify-center">
                                {type === 'success' && <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />}
                                {type === 'error' && <AlertCircle className="w-5 h-5 fill-destructive/20" />}
                                {type === 'info' && <Info className="w-5 h-5 fill-primary/20" />}
                            </div>
                            <p className="flex-1 text-sm font-bold tracking-tight">{message}</p>
                            <button
                                onClick={() => removeNotification(id)}
                                className="shrink-0 p-1.5 opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
};