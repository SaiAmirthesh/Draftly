import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../services/auth";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import logo from '../assets/design-tool.png'

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const { error } = await signIn(email, password);
        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate("/main");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -ml-48 -mb-48" />

            <div className="max-w-md w-full relative">
                <div className="text-center mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 group mb-6">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                            <img src={logo} className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Draftly</span>
                    </Link>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h2>
                    <p className="text-muted-foreground">Continue your journey to effortless emails.</p>
                </div>

                <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="relative">
                                <label className="text-sm font-semibold mb-1.5 block px-1" htmlFor="email">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <div className="flex items-center justify-between mb-1.5 px-1">
                                    <label className="text-sm font-semibold" htmlFor="password">Password</label>
                                    <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</a>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border/40 text-center">
                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-bold text-primary hover:underline">
                                Create one free
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer info */}
                <div className="mt-12 flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium opacity-60">
                    <Sparkles className="w-3 h-3" />
                    AI-Enhanced Experience
                </div>
            </div>
        </div>
    );
}
