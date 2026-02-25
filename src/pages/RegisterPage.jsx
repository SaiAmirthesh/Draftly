import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUp, signInWithGoogle } from "../services/auth";
import { Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import logo from '../assets/design-tool.png'
import mail from '../assets/mail.jpeg'
export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );

  const Divider = () => (
    <div className="flex items-center gap-3 my-6">
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-muted-foreground uppercase tracking-widest">or</span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );

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
      setTimeout(() => navigate("/main"), 2000);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      setGoogleLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Registration successful</h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to Draftly! Redirecting you to the dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Side - Image & Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-secondary relative overflow-hidden p-12 order-2">
        <div className="absolute inset-0 z-0">
          <img
            src={mail}
            alt="Background"
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20 z-10" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
        </div>

        <div className="relative z-20 flex justify-end">
        </div>

        <div className="relative z-20 max-w-lg text-right self-end">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-[1.1]">
            Unleash your <br />
            <span className="text-primary">productivity.</span>
          </h1>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden order-1">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -ml-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mb-48 pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-10 lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 group mb-6 lg:hidden">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center transition-transform group-hover:scale-110">
                <img src={logo} className="w-10 h-10 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold tracking-tight">Draftly</span>
            </Link>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Create account</h2>
            <p className="text-muted-foreground">Start your journey to zero inbox stress.</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-secondary/80 border border-border rounded-md font-bold text-foreground hover:bg-secondary transition disabled:opacity-50 disabled:cursor-not-allowed mb-6 shadow-sm"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
          </button>

          <Divider />

          <div className="bg-card border border-border/50 rounded-lg p-6 sm:p-8 shadow-xl backdrop-blur-sm">
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
                      className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                      className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>


              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-destructive text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
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
        </div>
      </div>
    </div>
  );
}