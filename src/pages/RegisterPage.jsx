import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../services/auth";
import { Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import logo from '../assets/design-tool.png'

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error, data } = await signUp(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // If confirmation is required, we stay here. If not, we might navigate.
      // For simplicity, let's just wait 2 seconds then navigate to login or main
      setTimeout(() => navigate("/login"), 3000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Check your email</h2>
          <p className="text-muted-foreground leading-relaxed">
            We've sent a verification link to <span className="text-foreground font-bold">{email}</span>.
            Please follow the instructions to activate your account.
          </p>
          <Link to="/login" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
            Back to login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -ml-48 -mt-48" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mb-48" />

      <div className="max-w-md w-full relative">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 group mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
              <img src={logo} className="w-10 h-10 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Draftly</span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Create account</h2>
          <p className="text-muted-foreground">Start your journey to zero inbox stress.</p>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                <label className="text-sm font-semibold mb-1.5 block px-1" htmlFor="password">Create Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="text-[10px] text-muted-foreground px-1 leading-relaxed">
              By signing up, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
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
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && <Sparkles className="w-4 h-4" />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/40 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-primary hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-12 flex items-center justify-center gap-6 text-xs text-muted-foreground font-medium opacity-60">
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> No credit card</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Free forever trial</div>
        </div>
      </div>
    </div>
  );
}